#!/usr/bin/env kotlin

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.system.exitProcess

class JsonParser(private val text: String) {
    private var index = 0
    fun parse(): Any? {
        skip()
        val value = parseValue()
        skip()
        if (index != text.length) error("unexpected trailing content at $index")
        return value
    }
    private fun parseValue(): Any? {
        skip()
        return when (peek()) {
            '{' -> parseObject()
            '[' -> parseArray()
            '"' -> parseString()
            't' -> parseLiteral("true", true)
            'f' -> parseLiteral("false", false)
            'n' -> parseLiteral("null", null)
            else -> parseNumber()
        }
    }
    private fun parseObject(): LinkedHashMap<String, Any?> {
        expect('{')
        skip()
        val map = linkedMapOf<String, Any?>()
        if (peek() == '}') {
            index++
            return map
        }
        while (true) {
            skip()
            val key = parseString()
            skip()
            expect(':')
            map[key] = parseValue()
            skip()
            when (peek()) {
                ',' -> index++
                '}' -> {
                    index++
                    return LinkedHashMap(map)
                }
                else -> error("expected ',' or '}' at $index")
            }
        }
    }
    private fun parseArray(): List<Any?> {
        expect('[')
        skip()
        val list = mutableListOf<Any?>()
        if (peek() == ']') {
            index++
            return list
        }
        while (true) {
            list += parseValue()
            skip()
            when (peek()) {
                ',' -> index++
                ']' -> {
                    index++
                    return list
                }
                else -> error("expected ',' or ']' at $index")
            }
        }
    }
    private fun parseString(): String {
        expect('"')
        val out = StringBuilder()
        while (index < text.length) {
            when (val ch = text[index++]) {
                '"' -> return out.toString()
                '\\' -> {
                    val esc = text[index++]
                    out.append(
                        when (esc) {
                            '"', '\\', '/' -> esc
                            'b' -> '\b'
                            'f' -> '\u000c'
                            'n' -> '\n'
                            'r' -> '\r'
                            't' -> '\t'
                            'u' -> text.substring(index, index + 4).also { index += 4 }.toInt(16).toChar()
                            else -> error("bad escape: \\$esc")
                        }
                    )
                }
                else -> out.append(ch)
            }
        }
        error("unterminated string")
    }
    private fun parseNumber(): Number {
        val start = index
        if (peek() == '-') index++
        while (peek()?.isDigit() == true) index++
        if (peek() == '.') {
            index++
            while (peek()?.isDigit() == true) index++
        }
        if (peek() == 'e' || peek() == 'E') {
            index++
            if (peek() == '+' || peek() == '-') index++
            while (peek()?.isDigit() == true) index++
        }
        val raw = text.substring(start, index)
        return raw.toDoubleOrNull() ?: error("bad number: $raw")
    }
    private fun parseLiteral(token: String, value: Any?): Any? {
        require(text.startsWith(token, index)) { "expected $token at $index" }
        index += token.length
        return value
    }
    private fun skip() { while (index < text.length && text[index].isWhitespace()) index++ }
    private fun peek(): Char? = text.getOrNull(index)
    private fun expect(ch: Char) {
        if (peek() != ch) error("expected '$ch' at $index")
        index++
    }
}

fun jsonObject(value: Any?): Map<String, Any?> = value as? Map<String, Any?> ?: emptyMap()
fun toJson(value: Any?, indent: String = ""): String = when (value) {
    null -> "null"
    is String -> "\"" + value
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\b", "\\b")
        .replace("\u000c", "\\f")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t") + "\""
    is Number, is Boolean -> value.toString()
    is Map<*, *> -> {
        if (value.isEmpty()) "{}" else {
            val childIndent = "$indent  "
            value.entries.joinToString(prefix = "{\n", postfix = "\n$indent}") { (key, item) ->
                "$childIndent${toJson(key.toString())}: ${toJson(item, childIndent)}"
            }
        }
    }
    is Iterable<*> -> {
        val list = value.toList()
        if (list.isEmpty()) "[]" else {
            val childIndent = "$indent  "
            list.joinToString(prefix = "[\n", postfix = "\n$indent]") { item ->
                "$childIndent${toJson(item, childIndent)}"
            }
        }
    }
    else -> toJson(value.toString(), indent)
}

if (args.size != 4) {
    System.err.println("Usage: write_forge_client_version.main.kts SRC_JSON DEST_JSON MC_VERSION VERSION_ID")
    exitProcess(2)
}

val src = Paths.get(args[0])
val dest = Paths.get(args[1])
val mcVersion = args[2]
val versionId = args[3]

val forge = jsonObject(JsonParser(Files.readString(src)).parse())
val out = linkedMapOf<String, Any?>(
    "id" to versionId,
    "inheritsFrom" to mcVersion,
    "type" to "release",
    "mainClass" to forge["mainClass"],
    "minecraftArguments" to forge["minecraftArguments"],
    "libraries" to (forge["libraries"] ?: emptyList<Any?>()),
)
dest.parent?.let { Files.createDirectories(it) }
Files.writeString(dest, toJson(out) + "\n")

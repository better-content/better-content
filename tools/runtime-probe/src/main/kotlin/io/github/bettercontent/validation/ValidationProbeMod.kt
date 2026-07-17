package io.github.bettercontent.validation

import com.google.gson.JsonObject
import com.google.gson.JsonParser
import com.mojang.brigadier.arguments.StringArgumentType
import com.mojang.brigadier.builder.LiteralArgumentBuilder
import com.mojang.logging.LogUtils
import net.minecraft.commands.CommandSourceStack
import net.minecraft.commands.Commands
import net.minecraft.network.chat.Component
import net.minecraft.resources.ResourceLocation
import net.minecraftforge.common.MinecraftForge
import net.minecraftforge.event.RegisterCommandsEvent
import net.minecraftforge.fml.common.Mod
import net.minecraftforge.fml.loading.FMLPaths
import net.minecraftforge.registries.ForgeRegistries
import org.slf4j.Logger
import java.nio.file.Files

@Mod(ValidationProbeMod.MOD_ID)
class ValidationProbeMod {
    init {
        MinecraftForge.EVENT_BUS.addListener(ValidationProbeCommands::register)
    }

    companion object {
        const val MOD_ID = "bc_validation_probe"
        val LOGGER: Logger = LogUtils.getLogger()
    }
}

object ValidationProbeCommands {
    private const val resultPrefix = "BC_VALIDATION_PROBE_RESULT "

    fun register(event: RegisterCommandsEvent) {
        event.dispatcher.register(
            Commands.literal("bcvalidate")
                .requires { it.hasPermission(4) }
                .then(LiteralArgumentBuilder.literal<CommandSourceStack>("ping").executes { context ->
                    emit(context.source, "ping", "passed", emptyList(), emptyList())
                    1
                })
                .then(
                    Commands.literal("phase")
                        .then(Commands.argument("id", StringArgumentType.word()).executes { context ->
                            validatePhase(context.source, StringArgumentType.getString(context, "id"))
                        }),
                ),
        )
    }

    private fun validatePhase(source: CommandSourceStack, phaseId: String): Int {
        val contractPath = FMLPaths.CONFIGDIR.get().resolve("bc-validation-probe/progression_milestones.json")
        if (!Files.exists(contractPath)) {
            emit(source, phaseId, "failed", listOf("missing contract: $contractPath"), emptyList())
            return 0
        }
        val root = Files.newBufferedReader(contractPath).use { JsonParser.parseReader(it).asJsonObject }
        val phase = root.getAsJsonArray("phases")
            ?.map { it.asJsonObject }
            ?.firstOrNull { it.get("id")?.asString == phaseId }
        if (phase == null) {
            emit(source, phaseId, "failed", listOf("unknown phase"), emptyList())
            return 0
        }
        val errors = mutableListOf<String>()
        val recipes = mutableListOf<String>()
        phase.stringList("expectedOutputs").forEach { output ->
            if (ForgeRegistries.ITEMS.getValue(ResourceLocation.tryParse(output)) == null) errors += "missing item $output"
        }
        phase.stringList("recipeIds").forEach { recipeId ->
            val key = ResourceLocation.tryParse(recipeId)
            if (key == null || source.server.recipeManager.byKey(key).isEmpty) errors += "missing recipe $recipeId" else recipes += recipeId
        }
        emit(source, phaseId, if (errors.isEmpty()) "passed" else "failed", errors, recipes)
        return if (errors.isEmpty()) 1 else 0
    }

    private fun JsonObject.stringList(name: String): List<String> =
        getAsJsonArray(name)?.mapNotNull { element -> element.takeIf { it.isJsonPrimitive }?.asString } ?: emptyList()

    private fun emit(source: CommandSourceStack, phase: String, status: String, errors: List<String>, recipes: List<String>) {
        val json = JsonObject().apply {
            addProperty("schema", "bc.progression_validation_probe.v1")
            addProperty("phase", phase)
            addProperty("status", status)
            add("errors", errors.toJsonArray())
            add("recipes", recipes.toJsonArray())
        }
        ValidationProbeMod.LOGGER.info("{}{}", resultPrefix, json)
        source.sendSuccess({ Component.literal("$phase: $status") }, true)
    }

    private fun List<String>.toJsonArray() = com.google.gson.JsonArray().also { array -> forEach(array::add) }
}

import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.jetbrains.kotlin.jvm") version "1.9.25"
    id("net.minecraftforge.gradle") version "[6.0,6.2)"
}

val minecraftVersion = property("minecraft_version") as String
val forgeVersion = property("forge_version") as String
val kotlinForForgeVersion = property("kotlinforforge_version") as String
val modId = property("mod_id") as String
val modVersion = property("mod_version") as String

group = property("mod_group") as String
version = modVersion

base { archivesName.set(modId) }

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}

kotlin { jvmToolchain(17) }

minecraft {
    mappings("official", minecraftVersion)
    copyIdeResources = true
    runs {
        configureEach {
            workingDirectory(project.file("run"))
            property("forge.logging.console.level", "info")
            mods {
                create(modId) { source(sourceSets.main.get()) }
            }
        }
        create("server") { arg("--nogui") }
    }
}

repositories {
    mavenCentral()
    maven("https://maven.minecraftforge.net")
    maven("https://thedarkcolour.github.io/KotlinForForge/")
}

dependencies {
    minecraft("net.minecraftforge:forge:$minecraftVersion-$forgeVersion")
    implementation("thedarkcolour:kotlinforforge:$kotlinForForgeVersion")
    testImplementation(kotlin("test"))
}

tasks.processResources {
    inputs.properties(mapOf("modId" to modId, "modVersion" to modVersion, "forgeVersion" to forgeVersion, "minecraftVersion" to minecraftVersion))
    filesMatching(listOf("META-INF/mods.toml", "pack.mcmeta")) {
        expand(mapOf("modId" to modId, "modVersion" to modVersion, "forgeVersion" to forgeVersion, "minecraftVersion" to minecraftVersion))
    }
}

tasks.jar { finalizedBy("reobfJar") }

val stageRuntimeJar by tasks.registering(Copy::class) {
    dependsOn(tasks.named("reobfJar"))
    from(layout.buildDirectory.file("reobfJar/output.jar"))
    into(layout.buildDirectory.dir("libs"))
    rename { "$modId-$modVersion.jar" }
}

tasks.assemble { dependsOn(stageRuntimeJar) }

tasks.withType<JavaCompile>().configureEach { options.release.set(17) }
tasks.withType<KotlinCompile>().configureEach { kotlinOptions.jvmTarget = "17" }

// Forge 1.20.1 + KubeJS 6 (Rhino-safe ES5)
// Pack-owned pillager pressure loop.
// Base Raid disables vanilla patrols when custom patrols are enabled, but its
// CustomPatrolSpawner is not registered in base_raid-0.5.jar. This script owns
// the reliable overworld patrol pressure and leaves Base Raid to handle Bad Omen
// and raid triggering.

var BTM_PATROL_ENABLED = true
var BTM_PATROL_INTERVAL_TICKS = 1200
var BTM_PATROL_CHANCE = 0.95
var BTM_PATROL_MIN_RADIUS = 32
var BTM_PATROL_MAX_RADIUS = 64
var BTM_PATROL_MIN_PILLAGERS = 4
var BTM_PATROL_MAX_PILLAGERS = 7
var BTM_PATROL_SPECIAL_CHANCE = 0.75
var BTM_PATROL_SPECIAL_COUNT = 2
var BTM_PATROL_TAG = 'btm_pillager_patrol'
var BTM_PATROL_DEBUG = true

var btmPatrolTicks = 0
var btmPatrolLastPlayerCount = 0
var btmPatrolLastSpawnCount = 0
var btmPatrolLastStatus = 'loaded'

var BTM_PATROL_SPECIALS = [
    'minecraft:vindicator',
    'minecraft:evoker',
    'minecraft:witch',
    'takesapillage:archer',
    'takesapillage:skirmisher',
    'takesapillage:legioner',
    'savage_and_ravage:griefer',
    'savage_and_ravage:executioner',
    'savage_and_ravage:iceologer',
    'savage_and_ravage:trickster'
]

var BtmPatrolBlockPos = Java.loadClass('net.minecraft.core.BlockPos')
var BtmPatrolHeightmapTypes = Java.loadClass('net.minecraft.world.level.levelgen.Heightmap$Types')

function btmPatrolInt(n, fallback) {
    n = Number(n)
    if (!isFinite(n)) return fallback
    return Math.floor(n)
}

function btmPatrolDimId(level) {
    try { return String(level.dimension.location().toString()) } catch (e) {}
    try { return String(level.dimension) } catch (e2) {}
    return 'minecraft:overworld'
}

function btmPatrolLog(server, message) {
    try { server.console.log('[btm_patrols] ' + message) } catch (e) {}
}

function btmPatrolRandomInt(min, max) {
    min = btmPatrolInt(min, 0)
    max = btmPatrolInt(max, min)
    if (max < min) max = min
    return min + Math.floor(Math.random() * (max - min + 1))
}

function btmPatrolPlayerName(player) {
    try { return String(player.name.string) } catch (e) {}
    try { return String(player.getName().getString()) } catch (e2) {}
    try { return String(player.username) } catch (e3) {}
    return ''
}

function btmPatrolIsSpectator(player) {
    try { if (player.isSpectator()) return true } catch (e) {}
    try { if (player.spectator) return true } catch (e2) {}
    return false
}

function btmPatrolSurfaceY(level, x, z, fallbackY) {
    var pos = new BtmPatrolBlockPos(btmPatrolInt(x, 0), 0, btmPatrolInt(z, 0))
    try {
        return btmPatrolInt(level.getHeightmapPos(BtmPatrolHeightmapTypes.MOTION_BLOCKING_NO_LEAVES, pos).getY(), fallbackY)
    } catch (e) {}
    try {
        return btmPatrolInt(level.minecraftLevel.getHeightmapPos(BtmPatrolHeightmapTypes.MOTION_BLOCKING_NO_LEAVES, pos).getY(), fallbackY)
    } catch (e2) {}
    try {
        return btmPatrolInt(level.getHeight(BtmPatrolHeightmapTypes.MOTION_BLOCKING_NO_LEAVES, btmPatrolInt(x, 0), btmPatrolInt(z, 0)), fallbackY)
    } catch (e3) {}
    return btmPatrolInt(fallbackY, 64)
}

function btmPatrolChooseSpawn(player) {
    var baseX = btmPatrolInt(player.blockX, btmPatrolInt(player.x, 0))
    var baseY = btmPatrolInt(player.blockY, btmPatrolInt(player.y, 64))
    var baseZ = btmPatrolInt(player.blockZ, btmPatrolInt(player.z, 0))
    var angle = Math.random() * Math.PI * 2
    var radius = btmPatrolRandomInt(BTM_PATROL_MIN_RADIUS, BTM_PATROL_MAX_RADIUS)
    var x = baseX + Math.round(Math.cos(angle) * radius)
    var z = baseZ + Math.round(Math.sin(angle) * radius)
    var y = btmPatrolSurfaceY(player.level, x, z, baseY)
    if (y < -60) y = baseY
    if (y > 320) y = baseY
    return { x: x, y: y, z: z }
}

function btmPatrolSummon(server, dim, entityId, x, y, z, nbt) {
    var sx = (Number(x) + 0.5).toFixed(1)
    var sy = btmPatrolInt(y, 64)
    var sz = (Number(z) + 0.5).toFixed(1)
    var command = 'execute in ' + dim + ' run summon ' + entityId + ' ' + sx + ' ' + sy + ' ' + sz + ' ' + nbt
    var result = server.runCommandSilent(command)
    return btmPatrolInt(result, 0)
}

function btmPatrolSpawnGroup(server, player, force) {
    if (!BTM_PATROL_ENABLED && !force) return 0
    if (!player || !player.level) return 0
    if (btmPatrolIsSpectator(player)) return 0

    var dim = btmPatrolDimId(player.level)
    if (dim !== 'minecraft:overworld') return 0
    if (!force && Math.random() > BTM_PATROL_CHANCE) return 0

    var where = btmPatrolChooseSpawn(player)
    var count = btmPatrolRandomInt(BTM_PATROL_MIN_PILLAGERS, BTM_PATROL_MAX_PILLAGERS)
    var leaderNbt = '{PatrolLeader:1b,Tags:["' + BTM_PATROL_TAG + '"],CanPickUpLoot:0b}'
    var normalNbt = '{Tags:["' + BTM_PATROL_TAG + '"],CanPickUpLoot:0b}'
    var commands = 0

    commands += btmPatrolSummon(server, dim, 'minecraft:pillager', where.x, where.y, where.z, leaderNbt)

    for (var i = 0; i < count; i++) {
        var dx = btmPatrolRandomInt(-4, 4)
        var dz = btmPatrolRandomInt(-4, 4)
        commands += btmPatrolSummon(server, dim, 'minecraft:pillager', where.x + dx, where.y, where.z + dz, normalNbt)
    }

    if (Math.random() <= BTM_PATROL_SPECIAL_CHANCE || force) {
        for (var j = 0; j < BTM_PATROL_SPECIAL_COUNT; j++) {
            var special = BTM_PATROL_SPECIALS[btmPatrolRandomInt(0, BTM_PATROL_SPECIALS.length - 1)]
            var sx = where.x + btmPatrolRandomInt(-5, 5)
            var sz = where.z + btmPatrolRandomInt(-5, 5)
            commands += btmPatrolSummon(server, dim, special, sx, where.y, sz, normalNbt)
        }
    }

    btmPatrolLastSpawnCount++
    btmPatrolLastStatus = 'spawned near ' + btmPatrolPlayerName(player) + ' at ' + dim + ' ' + where.x + ' ' + where.y + ' ' + where.z + ' command_success=' + commands
    btmPatrolLog(server, btmPatrolLastStatus)
    return 1
}

function btmPatrolForEachPlayer(server, fn) {
    var count = 0
    try {
        var list = server.getPlayerList().getPlayers()
        for (var i = 0; i < list.size(); i++) {
            count++
            fn(list.get(i))
        }
        return count
    } catch (e) {
        btmPatrolLastStatus = 'getPlayerList failed: ' + e
    }
    try {
        var players = server.players
        if (players && players.size) {
            for (var j = 0; j < players.size(); j++) {
                count++
                fn(players.get(j))
            }
            return count
        }
        if (players && players.length) {
            for (var k = 0; k < players.length; k++) {
                count++
                fn(players[k])
            }
            return count
        }
    } catch (e2) {
        btmPatrolLastStatus = 'server.players failed: ' + e2
    }
    return count
}

function btmPatrolRunAttempt(server, force) {
    var spawned = 0
    var players = btmPatrolForEachPlayer(server, function (player) {
        spawned += btmPatrolSpawnGroup(server, player, force)
    })
    btmPatrolLastPlayerCount = players
    if (BTM_PATROL_DEBUG || force) {
        btmPatrolLog(server, 'attempt force=' + force + ' players=' + players + ' spawned_groups=' + spawned + ' ticks=' + btmPatrolTicks + ' status=' + btmPatrolLastStatus)
    }
}

ServerEvents.tick(function (event) {
    btmPatrolTicks++
    if (btmPatrolTicks % BTM_PATROL_INTERVAL_TICKS !== 0) return

    try {
        btmPatrolRunAttempt(event.server, false)
    } catch (e) {
        btmPatrolLastStatus = 'tick failure: ' + e
        btmPatrolLog(event.server, btmPatrolLastStatus)
        throw e
    }
})

ServerEvents.commandRegistry(function (event) {
    var Commands = Java.loadClass('net.minecraft.commands.Commands')

    event.register(
        Commands.literal('btmpatrol')
        .requires(function (src) { return src.hasPermission(2) })
        .then(Commands.literal('now').executes(function (ctx) {
            var server = ctx.getSource().getServer()
            btmPatrolRunAttempt(server, true)
            return 1
        }))
        .then(Commands.literal('status').executes(function (ctx) {
            var server = ctx.getSource().getServer()
            var msg = 'enabled=' + BTM_PATROL_ENABLED + ' ticks=' + btmPatrolTicks + ' last_players=' + btmPatrolLastPlayerCount + ' total_spawns=' + btmPatrolLastSpawnCount + ' last_status=' + btmPatrolLastStatus
            btmPatrolLog(server, 'status ' + msg)
            try { ctx.getSource().sendSuccess(function () { return Java.loadClass('net.minecraft.network.chat.Component').literal('[btm_patrols] ' + msg) }, false) } catch (e) {}
            return 1
        }))
    )
})

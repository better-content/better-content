// Savage & Ravage's Trickster applies this effect at Weight III through both
// confusion bolts and rune prisons. Denying the effect keeps Tricksters active
// without allowing either attack to burden players or other living entities.
var BcMobEffects = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
var BcEventResult = Java.loadClass('net.minecraftforge.eventbus.api.Event$Result')

ForgeEvents.onEvent('net.minecraftforge.event.entity.living.MobEffectEvent$Applicable', function (event) {
    var effect = event.getEffectInstance().getEffect()
    if (String(BcMobEffects.MOB_EFFECT.getKey(effect)) === 'savage_and_ravage:weight') {
        event.setResult(BcEventResult.DENY)
    }
})

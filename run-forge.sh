#!/usr/bin/env sh
# Raw Forge diagnostic launcher. Normal server operation must use run.sh.
java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.4.13/unix_args.txt "$@"

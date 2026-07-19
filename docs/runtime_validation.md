# Runtime Validation

The runtime scenario surface has been intentionally removed. There are no headed, headless, smoke, or level-generating tests while the replacement one-world worldgen suite is being designed.

## Supported validation

```text
tools/bc doctor env
tools/bc test static
tools/bc test kotlin
tools/bc test fast
```

These checks validate source contracts, Kotlin tooling, and the configured custom-mod workspace commands. They are not runtime evidence and must not be presented as such.

## Historical evidence

Earlier smoke, scenario, Lost Cities, Valkyrien Skies, and worldgen results are historical only. They are not runnable contracts and do not gate releases.

## Replacement direction

Any future runtime suite must be designed before implementation, use exactly one reusable world per validation effort, and provide assertions that are specific, deterministic, and evidence-backed.

# B1F Normal Code Mirror

This directory is the path-matched normal-code mirror requested in B1F.

It keeps the original Beixiong relative paths so each file can be compared in four steps:

```text
original obfuscated file
-> docs/research/b1c-architecture-mirror/readable/<same path>
-> docs/research/b1c-architecture-mirror/normal-code-mirror/<same path>
-> docs/research/b1c-architecture-mirror/normal-code-reference/src/<domain module>
```

`normal-code-reference/` remains the runnable/importable smoke project. `normal-code-mirror/` is the file-by-file traceability layer.

No mirror file performs external Ozon/API/provider/account writes.

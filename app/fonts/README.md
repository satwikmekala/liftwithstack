These are the existing site's Latin font assets, copied from its self-hosted
Google Fonts build cache without changing the font data. Bricolage Grotesque is
700; Hanken Grotesk and JetBrains Mono are variable weight assets (400–700 used).

The matching SIL Open Font License files are included. Source licenses:
https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque
https://github.com/google/fonts/tree/main/ofl/hankengrotesk
https://github.com/google/fonts/tree/main/ofl/jetbrainsmono

Using the assets directly avoids the current runtime's unused-subset preloads
and removes Google Fonts fetching from subsequent builds.

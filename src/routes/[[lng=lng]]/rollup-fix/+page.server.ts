import "$entities/sitb/intl";
/**
 * Fake file to avoid infinite loop/deadlock/... in rollup `analyse` post-build phase, between
 * `building SSR bundle for production...`
 * and
 * `building for production...`
 */
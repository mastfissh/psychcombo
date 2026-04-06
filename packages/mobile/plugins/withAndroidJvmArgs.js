const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Increases JVM Metaspace size to prevent OutOfMemoryError during KSP/Kotlin compilation.
 * Sets org.gradle.jvmargs in android/gradle.properties.
 */
const withAndroidJvmArgs = (config) => {
  return withGradleProperties(config, (config) => {
    const properties = config.modResults;

    const jvmArgsIndex = properties.findIndex(
      (p) => p.type === 'property' && p.key === 'org.gradle.jvmargs'
    );

    const value = '-Xmx4096m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError';

    if (jvmArgsIndex >= 0) {
      properties[jvmArgsIndex].value = value;
    } else {
      properties.push({ type: 'property', key: 'org.gradle.jvmargs', value });
    }

    return config;
  });
};

module.exports = withAndroidJvmArgs;

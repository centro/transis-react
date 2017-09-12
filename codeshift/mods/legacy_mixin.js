import { canFindStateMixin } from "../submods/mixinDataExtract";

export default function legacy_mixin(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source)


  return root.toSource();
}

// module.exports = legacy_mixin;
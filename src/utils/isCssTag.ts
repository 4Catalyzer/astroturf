import { ResolvedOptions } from '../types';

export default function isCssTag(
  tagPath: any,
  {
    cssTagName,
    allowGlobal,
  }: Pick<ResolvedOptions, 'cssTagName' | 'allowGlobal'>,
): boolean {
  return (
    cssTagName !== false &&
    tagPath.node.name === cssTagName &&
    (tagPath.referencesImport('astroturf') ||
      tagPath.referencesImport('astroturf/react') ||
      (allowGlobal && tagPath.scope.hasGlobal(cssTagName)))
  );
}

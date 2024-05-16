import { ModInfo } from "../getModInfo";

const createModNode = (mod: ModInfo) => {
  const {
    folder = "",
    version = "",
    md5 = "",
    name = "",
    uuid = "",
    versionType = "",
  } = mod;

  const [major = 0n, minor = 0n, revision = 0n, build = 0n] = version
    .split(".")
    .map(BigInt);

  const versionNumberString =
    (major << 55n) + (minor << 47n) + (revision << 31n) + build; // eslint-disable-line no-bitwise

  const template = `
    <node id="ModuleShortDesc">
      <!--  ${name}  -->
      <attribute id="Folder" type="LSString" value="${folder}" />
      <attribute id="MD5" type="LSString" value="${md5}" />
      <attribute id="Name" type="LSString" value="${name}" />
      <attribute id="UUID" type="FixedString" value="${uuid}" />
      <attribute id="Version64" type="${versionType}" value="${versionNumberString.toString()}" />
    </node>
`;

  return template;
};

export { createModNode };

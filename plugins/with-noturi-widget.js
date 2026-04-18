const { withXcodeProject, withEntitlementsPlist } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const WIDGET_NAME = 'NoturiWidget';
const WIDGET_BUNDLE_ID = 'com.noturi.app.widget';
const APP_GROUP = 'group.com.noturi.app';
const TEAM_ID = '3JAT5MMB44';
const DEPLOYMENT_TARGET = '15.1';

const WIDGET_SWIFT_FILES = [
  'NoturiWidget.swift',
  'TodoEntry.swift',
  'TodoTimelineProvider.swift',
  'SharedDataManager.swift',
  'TodoWidgetService.swift',
  'TodoWidgetSmallView.swift',
  'TodoWidgetMediumView.swift',
  'ToggleTodoIntent.swift',
];

const withNoturiWidget = (config) => {
  config = withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.security.application-groups'] = [APP_GROUP];
    return config;
  });

  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const platformRoot = config.modRequest.platformProjectRoot;

    copyWidgetFiles(platformRoot);
    addWidgetExtension(project);

    return config;
  });

  return config;
};

function copyWidgetFiles(platformRoot) {
  const projectRoot = path.resolve(platformRoot, '..');
  const sourceDir = path.join(projectRoot, 'widgets', WIDGET_NAME);
  const targetDir = path.join(platformRoot, WIDGET_NAME);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`[withNoturiWidget] Widget source not found: ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  copyDirSync(sourceDir, targetDir);
  console.log(`[withNoturiWidget] Copied widget files to ${targetDir}`);
}

function copyDirSync(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyDirSync(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function addWidgetExtension(project) {
  if (project.pbxTargetByName(WIDGET_NAME)) {
    console.log(`[withNoturiWidget] Target already exists, skipping`);
    return;
  }

  const objs = project.hash.project.objects;

  // UUIDs 생성
  const uuids = {};
  const names = [
    'target', 'productRef', 'configList', 'debugConfig', 'releaseConfig',
    'sourcesPhase', 'frameworksPhase', 'resourcesPhase',
    'group', 'containerProxy', 'targetDependency',
    'embedPhase', 'embedBuildFile',
    ...WIDGET_SWIFT_FILES.map((f) => `fileRef_${f}`),
    ...WIDGET_SWIFT_FILES.map((f) => `buildFile_${f}`),
    'assetsFileRef', 'assetsBuildFile',
    'infoPlistRef', 'entitlementsRef',
  ];
  for (const name of names) {
    uuids[name] = project.generateUuid();
  }

  // === PBXFileReference ===
  if (!objs.PBXFileReference) objs.PBXFileReference = {};
  const fileRefs = objs.PBXFileReference;

  // Swift 소스 파일
  for (const file of WIDGET_SWIFT_FILES) {
    const uuid = uuids[`fileRef_${file}`];
    fileRefs[uuid] = {
      isa: 'PBXFileReference',
      lastKnownFileType: 'sourcecode.swift',
      path: file,
      sourceTree: '"<group>"',
    };
    fileRefs[`${uuid}_comment`] = file;
  }

  // Assets.xcassets
  fileRefs[uuids.assetsFileRef] = {
    isa: 'PBXFileReference',
    lastKnownFileType: 'folder.assetcatalog',
    path: 'Assets.xcassets',
    sourceTree: '"<group>"',
  };
  fileRefs[`${uuids.assetsFileRef}_comment`] = 'Assets.xcassets';

  // Info.plist
  fileRefs[uuids.infoPlistRef] = {
    isa: 'PBXFileReference',
    lastKnownFileType: 'text.plist.xml',
    path: 'Info.plist',
    sourceTree: '"<group>"',
  };
  fileRefs[`${uuids.infoPlistRef}_comment`] = 'Info.plist';

  // Entitlements
  fileRefs[uuids.entitlementsRef] = {
    isa: 'PBXFileReference',
    lastKnownFileType: 'text.plist.entitlements',
    path: `${WIDGET_NAME}.entitlements`,
    sourceTree: '"<group>"',
  };
  fileRefs[`${uuids.entitlementsRef}_comment`] = `${WIDGET_NAME}.entitlements`;

  // Product .appex
  fileRefs[uuids.productRef] = {
    isa: 'PBXFileReference',
    explicitFileType: '"wrapper.app-extension"',
    includeInIndex: 0,
    path: `${WIDGET_NAME}.appex`,
    sourceTree: 'BUILT_PRODUCTS_DIR',
  };
  fileRefs[`${uuids.productRef}_comment`] = `${WIDGET_NAME}.appex`;

  // === PBXBuildFile ===
  if (!objs.PBXBuildFile) objs.PBXBuildFile = {};
  const buildFiles = objs.PBXBuildFile;

  for (const file of WIDGET_SWIFT_FILES) {
    const uuid = uuids[`buildFile_${file}`];
    buildFiles[uuid] = {
      isa: 'PBXBuildFile',
      fileRef: uuids[`fileRef_${file}`],
      fileRef_comment: file,
    };
    buildFiles[`${uuid}_comment`] = `${file} in Sources`;
  }

  // Assets build file
  buildFiles[uuids.assetsBuildFile] = {
    isa: 'PBXBuildFile',
    fileRef: uuids.assetsFileRef,
    fileRef_comment: 'Assets.xcassets',
  };
  buildFiles[`${uuids.assetsBuildFile}_comment`] = 'Assets.xcassets in Resources';

  // Embed build file
  buildFiles[uuids.embedBuildFile] = {
    isa: 'PBXBuildFile',
    fileRef: uuids.productRef,
    fileRef_comment: `${WIDGET_NAME}.appex`,
    settings: { ATTRIBUTES: ['RemoveHeadersOnCopy'] },
  };
  buildFiles[`${uuids.embedBuildFile}_comment`] = `${WIDGET_NAME}.appex in Embed Foundation Extensions`;

  // === PBXGroup ===
  if (!objs.PBXGroup) objs.PBXGroup = {};
  const groups = objs.PBXGroup;

  // 위젯 그룹
  groups[uuids.group] = {
    isa: 'PBXGroup',
    children: [
      ...WIDGET_SWIFT_FILES.map((f) => ({ value: uuids[`fileRef_${f}`], comment: f })),
      { value: uuids.assetsFileRef, comment: 'Assets.xcassets' },
      { value: uuids.infoPlistRef, comment: 'Info.plist' },
      { value: uuids.entitlementsRef, comment: `${WIDGET_NAME}.entitlements` },
    ],
    path: WIDGET_NAME,
    sourceTree: '"<group>"',
    name: WIDGET_NAME,
  };
  groups[`${uuids.group}_comment`] = WIDGET_NAME;

  // 루트 그룹에 추가
  const rootGroupId = project.getFirstProject().firstProject.mainGroup;
  if (groups[rootGroupId] && groups[rootGroupId].children) {
    groups[rootGroupId].children.push({ value: uuids.group, comment: WIDGET_NAME });
  }

  // Products 그룹에 .appex 추가
  for (const gid in groups) {
    if (typeof groups[gid] === 'object' && groups[gid].name === 'Products') {
      groups[gid].children.push({ value: uuids.productRef, comment: `${WIDGET_NAME}.appex` });
      break;
    }
  }

  // === Build Phases ===
  // Sources
  if (!objs.PBXSourcesBuildPhase) objs.PBXSourcesBuildPhase = {};
  objs.PBXSourcesBuildPhase[uuids.sourcesPhase] = {
    isa: 'PBXSourcesBuildPhase',
    buildActionMask: 2147483647,
    files: WIDGET_SWIFT_FILES.map((f) => ({
      value: uuids[`buildFile_${f}`],
      comment: `${f} in Sources`,
    })),
    runOnlyForDeploymentPostprocessing: 0,
  };
  objs.PBXSourcesBuildPhase[`${uuids.sourcesPhase}_comment`] = 'Sources';

  // Frameworks (empty)
  if (!objs.PBXFrameworksBuildPhase) objs.PBXFrameworksBuildPhase = {};
  objs.PBXFrameworksBuildPhase[uuids.frameworksPhase] = {
    isa: 'PBXFrameworksBuildPhase',
    buildActionMask: 2147483647,
    files: [],
    runOnlyForDeploymentPostprocessing: 0,
  };
  objs.PBXFrameworksBuildPhase[`${uuids.frameworksPhase}_comment`] = 'Frameworks';

  // Resources
  if (!objs.PBXResourcesBuildPhase) objs.PBXResourcesBuildPhase = {};
  objs.PBXResourcesBuildPhase[uuids.resourcesPhase] = {
    isa: 'PBXResourcesBuildPhase',
    buildActionMask: 2147483647,
    files: [{ value: uuids.assetsBuildFile, comment: 'Assets.xcassets in Resources' }],
    runOnlyForDeploymentPostprocessing: 0,
  };
  objs.PBXResourcesBuildPhase[`${uuids.resourcesPhase}_comment`] = 'Resources';

  // Embed Foundation Extensions (메인 타겟용)
  if (!objs.PBXCopyFilesBuildPhase) objs.PBXCopyFilesBuildPhase = {};
  objs.PBXCopyFilesBuildPhase[uuids.embedPhase] = {
    isa: 'PBXCopyFilesBuildPhase',
    buildActionMask: 2147483647,
    dstPath: '""',
    dstSubfolderSpec: 13,
    files: [
      { value: uuids.embedBuildFile, comment: `${WIDGET_NAME}.appex in Embed Foundation Extensions` },
    ],
    name: '"Embed Foundation Extensions"',
    runOnlyForDeploymentPostprocessing: 0,
  };
  objs.PBXCopyFilesBuildPhase[`${uuids.embedPhase}_comment`] = 'Embed Foundation Extensions';

  // === Build Configurations ===
  if (!objs.XCBuildConfiguration) objs.XCBuildConfiguration = {};
  const buildConfigs = objs.XCBuildConfiguration;

  const commonSettings = {
    CODE_SIGN_ENTITLEMENTS: `"${WIDGET_NAME}/${WIDGET_NAME}.entitlements"`,
    CODE_SIGN_STYLE: 'Automatic',
    CURRENT_PROJECT_VERSION: '1',
    DEVELOPMENT_TEAM: TEAM_ID,
    GENERATE_INFOPLIST_FILE: 'NO',
    INFOPLIST_FILE: `"${WIDGET_NAME}/Info.plist"`,
    INFOPLIST_KEY_CFBundleDisplayName: '"Noturi Widget"',
    IPHONEOS_DEPLOYMENT_TARGET: DEPLOYMENT_TARGET,
    LD_RUNPATH_SEARCH_PATHS: '"$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks"',
    MARKETING_VERSION: '1.0',
    PRODUCT_BUNDLE_IDENTIFIER: `"${WIDGET_BUNDLE_ID}"`,
    PRODUCT_NAME: '"$(TARGET_NAME)"',
    SKIP_INSTALL: 'YES',
    SWIFT_VERSION: '5.0',
    TARGETED_DEVICE_FAMILY: '"1"',
    ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: 'AccentColor',
    ASSETCATALOG_COMPILER_WIDGET_BACKGROUND_COLOR_NAME: 'WidgetBackground',
  };

  buildConfigs[uuids.debugConfig] = {
    isa: 'XCBuildConfiguration',
    buildSettings: {
      ...commonSettings,
      OTHER_SWIFT_FLAGS: '"$(inherited) -D EXPO_CONFIGURATION_DEBUG"',
    },
    name: 'Debug',
  };
  buildConfigs[`${uuids.debugConfig}_comment`] = 'Debug';

  buildConfigs[uuids.releaseConfig] = {
    isa: 'XCBuildConfiguration',
    buildSettings: {
      ...commonSettings,
      OTHER_SWIFT_FLAGS: '"$(inherited) -D EXPO_CONFIGURATION_RELEASE"',
    },
    name: 'Release',
  };
  buildConfigs[`${uuids.releaseConfig}_comment`] = 'Release';

  // Configuration List
  if (!objs.XCConfigurationList) objs.XCConfigurationList = {};
  objs.XCConfigurationList[uuids.configList] = {
    isa: 'XCConfigurationList',
    buildConfigurations: [
      { value: uuids.debugConfig, comment: 'Debug' },
      { value: uuids.releaseConfig, comment: 'Release' },
    ],
    defaultConfigurationIsVisible: 0,
    defaultConfigurationName: 'Release',
  };
  objs.XCConfigurationList[`${uuids.configList}_comment`] = `Build configuration list for PBXNativeTarget "${WIDGET_NAME}"`;

  // === Container Proxy & Target Dependency ===
  if (!objs.PBXContainerItemProxy) objs.PBXContainerItemProxy = {};
  objs.PBXContainerItemProxy[uuids.containerProxy] = {
    isa: 'PBXContainerItemProxy',
    containerPortal: project.getFirstProject().uuid,
    containerPortal_comment: 'Project object',
    proxyType: 1,
    remoteGlobalIDString: uuids.target,
    remoteInfo: `"${WIDGET_NAME}"`,
  };
  objs.PBXContainerItemProxy[`${uuids.containerProxy}_comment`] = 'PBXContainerItemProxy';

  if (!objs.PBXTargetDependency) objs.PBXTargetDependency = {};
  objs.PBXTargetDependency[uuids.targetDependency] = {
    isa: 'PBXTargetDependency',
    target: uuids.target,
    target_comment: WIDGET_NAME,
    targetProxy: uuids.containerProxy,
    targetProxy_comment: 'PBXContainerItemProxy',
  };
  objs.PBXTargetDependency[`${uuids.targetDependency}_comment`] = 'PBXTargetDependency';

  // === PBXNativeTarget (위젯) ===
  if (!objs.PBXNativeTarget) objs.PBXNativeTarget = {};
  objs.PBXNativeTarget[uuids.target] = {
    isa: 'PBXNativeTarget',
    buildConfigurationList: uuids.configList,
    buildConfigurationList_comment: `Build configuration list for PBXNativeTarget "${WIDGET_NAME}"`,
    buildPhases: [
      { value: uuids.sourcesPhase, comment: 'Sources' },
      { value: uuids.frameworksPhase, comment: 'Frameworks' },
      { value: uuids.resourcesPhase, comment: 'Resources' },
    ],
    buildRules: [],
    dependencies: [],
    name: `"${WIDGET_NAME}"`,
    productName: `"${WIDGET_NAME}"`,
    productReference: uuids.productRef,
    productReference_comment: `${WIDGET_NAME}.appex`,
    productType: '"com.apple.product-type.app-extension"',
  };
  objs.PBXNativeTarget[`${uuids.target}_comment`] = WIDGET_NAME;

  // === 메인 타겟에 의존성 & Embed 추가 ===
  const mainTarget = project.getFirstTarget();
  if (mainTarget) {
    const mainUuid = mainTarget.uuid;
    const mt = objs.PBXNativeTarget[mainUuid];
    if (mt) {
      // 의존성 추가
      if (!mt.dependencies) mt.dependencies = [];
      mt.dependencies.push({
        value: uuids.targetDependency,
        comment: 'PBXTargetDependency',
      });

      // Embed 빌드 페이즈 추가
      if (!mt.buildPhases) mt.buildPhases = [];
      mt.buildPhases.push({
        value: uuids.embedPhase,
        comment: 'Embed Foundation Extensions',
      });
    }
  }

  // === PBXProject targets 배열에 추가 ===
  const projectSection = objs.PBXProject;
  for (const key in projectSection) {
    if (typeof projectSection[key] === 'object' && projectSection[key].targets) {
      projectSection[key].targets.push({
        value: uuids.target,
        comment: WIDGET_NAME,
      });
      break;
    }
  }

  console.log(`[withNoturiWidget] Added widget target successfully`);
}

module.exports = withNoturiWidget;

import { isObject, isMap, isSet, getValStrDesc } from '../support/util';
import { desc2dataType } from '../support/consts';
import { metasKey, verKey } from '../support/symbols';
import { verWrap } from '../support/inner-data';
import { carefulType2proxyItemFnKeys } from '../support/consts';
import { DraftMeta } from '../inner-types';


export function shouldGenerateProxyItems(parentType, key) {
  // !!! 对于 Array，直接生成 proxyItems
  if (parentType === 'Array') return true;
  const proxyItemFnKeys = carefulType2proxyItemFnKeys[parentType] || [];
  return proxyItemFnKeys.includes(key);
}

export function getKeyPath(mayContainMetaObj, curKey, metaVer) {
  const pathArr = [curKey];
  const meta = getMeta(mayContainMetaObj, metaVer);
  if (meta && meta.level > 0) {
    const { keyPath } = meta;
    return [...keyPath, curKey];
  }
  return pathArr;
}

export function getMeta(mayMetasProtoObj, metaVer): DraftMeta | null {
  const metas = getMetas(mayMetasProtoObj);
  if (metas) return metas[metaVer];
  return null;
}

export function getMetaForDraft(draft, metaVer) {
  return getMeta(draft.__proto__, metaVer);
}

export function getMetas(mayMetasProtoObj) {
  if (!mayMetasProtoObj) return null;
  return mayMetasProtoObj[metasKey]
}

// 调用处已保证 meta 不为空
export function makeCopy(meta: DraftMeta, alwaysNew = false) {
  const metaOwner: any = meta.self;

  if (Array.isArray(metaOwner)) {
    return meta.proxyItems || metaOwner.slice();
  }
  if (isObject(metaOwner)) {
    return { ...metaOwner };
  }
  if (isMap(metaOwner)) {
    return alwaysNew ? new Map(metaOwner) : (meta.proxyItems || new Map(metaOwner));
  }
  if (isSet(metaOwner)) {
    return alwaysNew ? new Set(metaOwner) : (meta.proxyItems || new Set(metaOwner));
  }
  throw new Error(`data ${metaOwner} try trigger getCopy, its type is ${typeof meta}`)
}

/**
 * 尝试生成copy
 * @param val 
 * @returns 
 */
export function tryMakeCopy(val: any) {
  if (Array.isArray(val)) {
    return val.slice();
  }
  if (val && isObject(val)) {
    return { ...val };
  }
  if (isMap(val)) {
    return new Map(val);
  }
  if (isSet(val)) {
    return new Set(val);
  }
  return val;
}


export function getUnProxyValue(value, metaVer) {
  const valueMeta = getMetaForDraft(value, metaVer);
  if (!valueMeta) return value;
  let copy = valueMeta.copy;
  if (!copy) {
    copy = makeCopy(valueMeta);
    valueMeta.copy = copy;
  }
  return copy;
}

// 外部已确保是obj
export function setMeta(obj, meta, metaVer) {
  const metas = getMetas(obj);
  metas && (metas[metaVer] = meta);
}

export function getMetaVer() {
  verWrap.value += 1;
  return verWrap.value;
}

export function getNextMetaLevel(mayContainMetaObj, metaVer) {
  const meta = getMeta(mayContainMetaObj, metaVer);
  return meta ? meta.level + 1 : 1;
}

export function getRealProto(val) {
  const proto = Object.getPrototypeOf(val);
  // 防止 Object.create(null) 创建的对象没有原型链
  if (!proto) return Object.prototype;
  return Object.getPrototypeOf(val);
}

export function setMetasProto(val, realProto) {
  // 把 metas 放到单独的 __proto__ 层里，确保写入的数据不会污染 Object.prototype
  //__proto__:
  //  Symbol('metas'): { ... }
  //  __proto__: Object | Array
  const metaProto = Object.create(null);
  Object.setPrototypeOf(metaProto, realProto);
  // 故意多写一层 __proto__ 容器
  Object.setPrototypeOf(val, metaProto);
  val.__proto__[metasKey] = {};
}

/**
 * 是否是 proxy 代理的草稿对象
 * @param mayDraft
 * @returns 
 */
export function isDraft(mayDraft) {
  const ver = mayDraft[verKey];
  return !!ver;
}

export function getDataNodeType(dataNode) {
  var strDesc = getValStrDesc(dataNode);
  const dataType = desc2dataType[strDesc];
  return dataType;
}

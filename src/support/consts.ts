/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *
 *  @Author: fantasticsoul
 *--------------------------------------------------------------------------------------------*/
import type { DataType } from '../inner-types';

/**
 * 因 3.0 做了大的架构改进，让其行为和 immer 保持了 100% 一致，和 2.0 版本处于不兼容状态
 * 此处标记版本号辅助测试用例为2.0走一些特殊逻辑
 */
export const LIMU_MAJOR_VER = 3;

export const VER = '3.5.7';

// 用于验证 proxyDraft 和 finishDraft 函数 是否能够匹配，记录 meta 数据
export const META_KEY = Symbol('M');

export const IMMU_META_KEY = Symbol('I');

export const IMMUT_BASE = Symbol('IMMUT_BASE');

export const oppositeOps = {
  add: 'remove',
  remove: 'add',
  set: 'delete',
  delete: 'set',
};

export const MAP = 'Map';
export const SET = 'Set';
export const ARRAY = 'Array';
export const OBJECT = 'Object';

export const CAREFUL_TYPES = { Map: MAP, Set: SET, Array: ARRAY } as const;

export const OBJ_DESC = '[object Object]';

export const MAP_DESC = '[object Map]';

export const SET_DESC = '[object Set]';

export const ARR_DESC = '[object Array]';

export const FN_DESC = '[object Function]';

export const desc2dataType: Record<string, DataType> = {
  [MAP_DESC]: MAP,
  [SET_DESC]: SET,
  [ARR_DESC]: ARRAY,
  [OBJ_DESC]: OBJECT,
};

export const SHOULD_REASSIGN_ARR_METHODS = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'];

export const SHOULD_REASSIGN_MAP_METHODS = ['set', 'clear', 'delete'];

export const SHOULD_REASSIGN_SET_METHODS = ['add', 'clear', 'delete'];

export const arrFnKeys = [
  'concat',
  'copyWithin',
  'entries',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'flat',
  'flatMap',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'pop',
  'push',
  'reduce',
  'reduceRight',
  'reverse',
  'shift',
  'unshift',
  'slice',
  'some',
  'sort',
  'splice',
  'values',
  'valueOf',
];

export const mapFnKeys = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'];

export const setFnKeys = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'];

export const CAREFUL_FNKEYS: Record<string, string[]> = {
  [MAP]: mapFnKeys,
  [SET]: setFnKeys,
  [ARRAY]: arrFnKeys,
};

export const CHANGE_FNKEYS: Record<string, string[]> = {
  [MAP]: ['clear', 'set', 'delete'],
  [SET]: ['clear', 'add', 'delete'],
  [ARRAY]: arrFnKeys,
};

export const PROXYITEM_FNKEYS: Record<string, string[]> = {
  [MAP]: ['forEach', 'get'],
  [SET]: ['forEach'],
  [ARRAY]: ['forEach', 'map'],
};

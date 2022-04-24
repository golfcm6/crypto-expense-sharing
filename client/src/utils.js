import sjcl from 'sjcl';
import { HEX_PATTERN } from './constants';

export const sha256 = str => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str));
export const isHexadecimal = str => HEX_PATTERN.test(str);
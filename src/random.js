import uuid4 from 'uuid/v4';

/**
 * Generates RFC4122 version 4 guid ()
 */

export default function random() {
  return uuid4().replace(/-/g, '');
}

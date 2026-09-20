/**
 * WASDCAT Brand Kit Generator - local asset store
 *
 * The setup lives in localStorage, which holds a few kilobytes comfortably and
 * a photograph not at all: a background image as a data URL runs into
 * megabytes, and localStorage is written as one string, so a single oversized
 * value does not just lose the image - it loses the whole setup with it. That
 * is why logos are capped at 512 px before they are stored.
 *
 * A background cannot be capped that way; it is composed underneath the overlay
 * at up to 1920 px and may be zoomed into. So it goes here instead. IndexedDB
 * has room for it, keeps it out of the setup's own budget, and brings the image
 * back on the next start.
 *
 * Every call resolves rather than rejects. A browser in private mode, with
 * storage switched off or out of room simply has no stored image, and the app
 * carries on with none - it must never be the reason nothing can be saved.
 */
(function () {
  const DB_NAME = 'wasdcat-bkg';
  const DB_VERSION = 1;
  const STORE = 'assets';

  let dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      let request;
      try {
        request = indexedDB.open(DB_NAME, DB_VERSION);
      } catch (err) {
        console.warn('[store] IndexedDB is not available:', err.message);
        resolve(null);
        return;
      }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('[store] IndexedDB could not be opened:', request.error && request.error.message);
        resolve(null);
      };
      request.onblocked = () => resolve(null);
    });
    return dbPromise;
  }

  function run(mode, work) {
    return open().then((db) => {
      if (!db) return null;
      return new Promise((resolve) => {
        let transaction;
        try {
          transaction = db.transaction(STORE, mode);
        } catch (err) {
          resolve(null);
          return;
        }
        const request = work(transaction.objectStore(STORE));
        transaction.onabort = () => resolve(null);
        transaction.onerror = () => resolve(null);
        request.onsuccess = () => resolve(request.result === undefined ? null : request.result);
        request.onerror = () => resolve(null);
      });
    }).catch(() => null);
  }

  /**
   * `value` is whatever structured clone accepts - the background is stored as
   * { dataUrl, name }, so that the name a setup refers to survives with it.
   */
  const put = (key, value) => run('readwrite', (store) => store.put(value, key));
  const get = (key) => run('readonly', (store) => store.get(key));
  const remove = (key) => run('readwrite', (store) => store.delete(key));

  window.BKG_STORE = { put, get, remove, BACKGROUND: 'background' };
})();

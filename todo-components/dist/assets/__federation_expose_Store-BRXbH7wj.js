import { importShared } from './__federation_fn_import-BV9PeGej.js';

const {atom,useAtom} = await importShared('jotai');

const countAtom = atom(0);
const useCount = () => useAtom(countAtom);

export { countAtom, useCount as default };

/*!
 * 
 *   Minimalistic trie implementation for autosuggest and autocomplete components.
 *   Author: Misha Moroshko
 *   Url: https://github.com/moroshko/autosuggest-trie
 *   License(s): MIT
 * 
 */

function createTrie(items, textKey, { comparator, splitRegex = /\s+/ } = {}) {
    const data = items;
    const trie = {};

    const compareFunction = comparator
        ? (id1, id2) => comparator(items[id1], items[id2])
        : null;

    const addWord = (word, id, wordIndex) => {
        const wordLength = word.length;
        let node = trie;

        for (let i = 0; i < wordLength; i++) {
            const letter = word[i];

            if (!node[letter]) {
                node[letter] = {
                    ids: []
                };
            }

            if (!node[letter].ids[wordIndex]) {
                node[letter].ids[wordIndex] = [];
            }

            node[letter].ids[wordIndex].push(id);

            if (compareFunction) {
                node[letter].ids[wordIndex].sort(compareFunction);
            }

            node = node[letter];
        }
    };

    const addPhrase = (phrase, id) => {
        const words = phrase.trim().toLowerCase().split(splitRegex);
        const wordsCount = words.length;

        for (let i = 0; i < wordsCount; i++) {
            addWord(words[i], id, i);
        }
    };

    const getWordIndices = word => {
        const wordLength = word.length;
        let node = trie;

        for (let i = 0; i < wordLength; i++) {
            if (node[word[i]]) {
                node = node[word[i]];
            } else {
                return [];
            }
        }

        const ids = node.ids;
        const length = ids.length;
        let result = [];

        for (let i = 0; i < length; i++) {
            if (ids[i]) {
                result = concatAndRemoveDups(result, ids[i]);
            }
        }

        return result;
    };

    const getPhraseIndices = (phrase, { limit, splitRegex = /\s+/ }) => {
        const words = phrase.toLowerCase().split(splitRegex).filter(Boolean);

        if (words.length === 0) {
            return [];
        }

        const wordsCount = words.length;
        let indicesArray = [];

        for (let i = 0; i < wordsCount; i++) {
            indicesArray[indicesArray.length] = getWordIndices(words[i]);
        }

        return intersectionWithLimit(indicesArray, limit);
    };

    const getMatches = (query, options = {}) => {
        const indices = getPhraseIndices(query, options);
        const indicesCount = indices.length;
        let result = [];

        for (let i = 0; i < indicesCount; i++) {
            result[result.length] = data[indices[i]];
        }

        return result;
    };

    const itemsCount = items.length;

    for (let i = 0; i < itemsCount; i++) {
        addPhrase(items[i][textKey], i);
    }

    return {
        getMatches
    };
};

function concatAndRemoveDups(arr1, arr2) {
    seen = [];
    arr1.concat(arr2).forEach( (a) => {if (!seen.includes(a)) seen.push(a);});
    return seen;
}


function intersectionWithLimit(arrays, limit) {
    const arraysCount = arrays.length;
    const firstArray = arrays[0];
    const firstArrayCount = firstArray.length;

    limit = limit || firstArrayCount;

    let result = [], candidate, found;

    for (let i = 0; i < firstArrayCount && result.length < limit; i++) {
        candidate = firstArray[i];
        found = true;

        for (let k = 1; k < arraysCount; k++) {
            if (arrays[k].indexOf(candidate) === -1) {
                found = false;
                break;
            }
        }

        if (found) {
            result[result.length] = candidate;
        }
    }

    return result;
};

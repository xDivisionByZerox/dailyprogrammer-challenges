import { readFileSync } from 'fs';

/**
 * @alias LetterValueSum
 * @link https://www.reddit.com/r/dailyprogrammer/comments/onfehl/20210719_challenge_399_easy_letter_value_sum/
 */
export class Challenge399 {

  private $wordList: string[] | null = null;

  /**
   * Assign every lowercase letter a value, from 1 for a to 26 for z. 
   * Given a string of lowercase letters, find the sum of the values of the letters in the string.
   * 
   * @example
   * challenge.letterSum("") => 0
   * challenge.letterSum("a") => 1
   * challenge.letterSum("z") => 26
   * challenge.letterSum("cab") => 6
   * challenge.letterSum("excellent") => 100
   * challenge.letterSum("microspectrophotometries") => 317
   */
  letterSum(word: string): number {
    // normalize input - just in case
    word = word.toLowerCase().trim();
    let sum = 0;
    const asciiCodeForA = 'a'.charCodeAt(0);
    for (const char of word) {
      sum += char.charCodeAt(0) - asciiCodeForA + 1;
    }

    return sum;
  }


  /**
   * `microspectrophotometries` is the only word with a letter sum of 317. 
   * Find the only word with a letter sum of 319.
   */
  bonus1(): string {
    return this.getWordList().find((word) => this.letterSum(word) === 319) ?? '';
  }

  /**
   * How many words have an odd letter sum?
   */
  bonus2(): number {
    return this.getWordList()
      .filter((word) => this.letterSum(word) % 2 !== 0)
      .length;
  }

  /**
   * There are 1921 words with a letter sum of 100, making it the second most common letter sum.
   * What letter sum is most common, and how many words have it?
   */
  bonus3(): { sum: number; count: number; } {
    const [sum, elements] = [...this.getLetterSumMap().entries()]
      .sort(([, a], [, b]) => a.length - b.length)
      .pop() ?? [0, []];

    return { sum, count: elements.length };
  }

  /**
   * `zyzzyva` and `biodegradabilities` have the same letter sum as each other (151), and their lengths differ by 11 letters.
   * Find the other pair of words with the same letter sum whose lengths differ by 11 letters.
   */
  bonus4(): [string, string][] {
    const wordsWithDiffEleven: [string, string][] = [];
    for (const wordsWithSameSum of [...this.getLetterSumMap().values()]) {
      for (const word1 of wordsWithSameSum) {
        for (const word2 of wordsWithSameSum) {
          if (word1.length - word2.length === 11) {
            wordsWithDiffEleven.push([word1, word2]);
          }
        }
      }
    }

    return wordsWithDiffEleven;
  }

  /**
   * `cytotoxicity` and `unreservedness` have the same letter sum as each other (188), and they have no letters in common.
   * Find a pair of words that have no letters in common, and that have the same letter sum, which is larger than 188.
   * (There are two such pairs, and one word appears in both pairs.)
   */
  bonus5() {
    const wordsByLetterSumMap = this.getLetterSumMap();
    const wordsWithNoSameChar: [string, string][] = [];
    for (const wordsWithSameSum of [...wordsByLetterSumMap.values()]) {
      for (const word1 of wordsWithSameSum) {
        const charSet1 = new Set(word1);
        for (const word2 of wordsWithSameSum) {
          const charSet2 = new Set(word2);
          const charSetFull = new Set([
            ...charSet1,
            ...charSet2,
          ]);
          if (charSetFull.size === charSet1.size + charSet2.size) {
            wordsWithNoSameChar.push([word1, word2]);
          }
        }
      }
    }

    return wordsWithNoSameChar;
  }

  /**
   * ## ⚠️Attention: This is not performant and takes a long time to run. Like really long.
   * 
   * The list of word `{ geographically, eavesdropper, woodworker, oxymorons }` contains 4 words.
   * Each word in the list has both a different number of letters, and a different letter sum.
   * The list is sorted both in descending order of word length, and ascending order of letter sum.
   * What's the longest such list you can find?
   */
  bonus6() {
    const lists: string[][] = [];

    for (const word of this.getWordList()) {
      const wordSum = this.letterSum(word);
      for (const list of lists) {
        if (list.every((elem) => elem.length !== word.length && this.letterSum(elem) !== wordSum)) {
          list.push(word);
        }
      }

      lists.push([word]);
    }

    return lists.sort((a, b) => a.length - b.length).pop()!;
  }

  /**
   * The dataset used for this challenge.
   */
  getWordList() {
    if (this.$wordList === null) {
      this.$wordList = readFileSync('./challenges/399-letter-value-sum/enable1.txt')
        .toString()
        .split('\n');
    }

    return this.$wordList;
  };

  private getLetterSumMap() {
    const map = new Map<number, string[]>();

    for (const word of this.getWordList()) {
      const sum = this.letterSum(word);
      const existing = map.get(sum);
      const newValue = existing !== undefined ? [...existing, word] : [word];
      map.set(sum, newValue);
    }

    return map;
  }

}

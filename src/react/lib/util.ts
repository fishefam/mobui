import { Completion, snippetCompletion } from '@codemirror/autocomplete'
import { type ClassValue, clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { Options } from 'prettier'
import babel from 'prettier/plugins/babel'
import estree from 'prettier/plugins/estree'
import html from 'prettier/plugins/html'
import css from 'prettier/plugins/postcss'
import typescript from 'prettier/plugins/typescript'
import { format } from 'prettier/standalone'
import { twMerge } from 'tailwind-merge'
import { TObject, TSetState } from 'type/common'
import { TLocalStorageKey, TStore, TStoreCodeKey } from 'type/store'

/**
 * Generates a BEM (Block Element Modifier) class name based on the provided parameters.
 *
 * @param {string} block - The block name (required).
 * @param {string} [element] - The optional element name.
 * @param {string} [modifier] - The optional modifier name.
 * @returns {string} - The generated BEM class name.
 */
export function bem(block: string, element?: string, modifier?: string): string {
  return `${block}${element ? `__${element}` : ''}${modifier ? `--${modifier}` : ''}`
}

/**
 * Generates a random string of the specified size using the characters provided.
 *
 * @param {number} [size=9] - The optional size of the generated string.
 * @returns {string} - The generated random string.
 */
export function nanoid(size: number = 9): string {
  const characterSet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  return customAlphabet(characterSet, size)()
}

/**
 * Merges and applies Tailwind CSS utility classes using the provided class names.
 *
 * @param {ClassValue[]} inputs - Variable number of class names.
 * @returns {string} - Merged and formatted Tailwind CSS utility classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string to start case (capitalizing the first letter of each word).
 * @param input - The input string to be converted to start case.
 * @returns The input string converted to start case.
 */
export function toStartCase(input: string): string {
  return input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase().concat(word.slice(1)))
    .join(' ')
}

/**
 * Retrieves a value from local storage using the provided key.
 * @param key - The key used to identify the value in local storage.
 * @returns The value associated with the provided key in local storage, or an empty string if not found.
 */
export function getLocalStorageItem(key: TLocalStorageKey): string {
  return localStorage.getItem(key) ?? ''
}

/**
 * Checks if an object has specific properties with non-falsy values.
 * @param property - The object to check for properties.
 * @param keys - The list of property keys to check.
 * @returns A boolean indicating whether the object has all specified properties.
 */
export function hasProps<T extends string, U>(keys: T[], property: TObject): property is { [key in T]: U } {
  const checks = keys.map((key) => !!property[key]).filter((v) => !v)
  return checks.length === 0
}

export function hasString<T extends string>(strings: T[], value = ''): value is T {
  return strings.includes(value as T)
}

export function prettier(value: string, language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS') {
  const option: Options = {
    parser: language === 'HTML' ? 'html' : language === 'CSS' ? 'css' : 'typescript',
    plugins: language === 'HTML' ? [babel, estree, html] : language === 'CSS' ? [css] : [typescript, estree, babel],
  }

  return format(value, {
    ...option,
    htmlWhitespaceSensitivity: 'ignore',
    printWidth: 80,
    semi: true,
    trailingComma: 'none',
    useTabs: false,
  })
}

export function getBaseJsCompletion() {
  const kwCompletion = (name: string) => ({ label: name, type: 'keyword' })
  const keywords =
    'break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield'
      .split(' ')
      .map(kwCompletion)
  const snippets: readonly Completion[] = [
    snippetCompletion('function ${name}(${params}) {\n\t${}\n}', {
      detail: 'definition',
      label: 'function',
      type: 'keyword',
    }),
    snippetCompletion('for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}', {
      detail: 'loop',
      label: 'for',
      type: 'keyword',
    }),
    snippetCompletion('for (let ${name} of ${collection}) {\n\t${}\n}', {
      detail: 'of loop',
      label: 'for',
      type: 'keyword',
    }),
    snippetCompletion('do {\n\t${}\n} while (${})', {
      detail: 'loop',
      label: 'do',
      type: 'keyword',
    }),
    snippetCompletion('while (${}) {\n\t${}\n}', {
      detail: 'loop',
      label: 'while',
      type: 'keyword',
    }),
    snippetCompletion('try {\n\t${}\n} catch (${error}) {\n\t${}\n}', {
      detail: '/ catch block',
      label: 'try',
      type: 'keyword',
    }),
    snippetCompletion('if (${}) {\n\t${}\n}', {
      detail: 'block',
      label: 'if',
      type: 'keyword',
    }),
    snippetCompletion('if (${}) {\n\t${}\n} else {\n\t${}\n}', {
      detail: '/ else block',
      label: 'if',
      type: 'keyword',
    }),
    snippetCompletion('class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}', {
      detail: 'definition',
      label: 'class',
      type: 'keyword',
    }),
  ]

  return snippets.concat(keywords)
}

export function updateJsCompletionList(html: string, setCompletion: TSetState<Completion[]>) {
  const ids = (html.match(/id="([^"]*)"/gi) ?? []).map((match) => match.replace(/^id="|"$/g, ''))
  const completionList: Completion[] = ids.map((id) =>
    snippetCompletion(`document.querySelector("#${id}")`, {
      label: `select ${id}`,
      type: 'method',
    }),
  )
  setCompletion(completionList)
}

export function getCodeStore(store: TStore, language: 'ALGORITHM' | 'CSS' | 'HTML' | 'JS', forceAlgo = false) {
  return store[
    forceAlgo
      ? ('algorithm' as TStoreCodeKey)
      : (`${store.section[0]}${language !== 'ALGORITHM' ? language : ''}` as TStoreCodeKey)
  ]
}

export function getAlgoCompletionList(): Completion[] {
  const main: Completion[] = [
    {
      label: 'condition: a;',
    },
    {
      info: 'Returns 1.0 if a and b are equal. Otherwise, it returns 0.0. \n\nExample: \nif(eq($a, $b), "Red", "Green"); \nReturns Red if $a=$b, and Green otherwise.',
      label: 'eq(a, b)',
    },
    {
      info: 'Returns 1.0 if a is greater than or equal to b. Otherwise, it returns 0.0. \n\nExample: \nif(ge($a, $b), "Red", "Green"); \nReturns Red if $a>=$b, and Green otherwise.',
      label: 'ge(a, b)',
    },
    {
      info: 'Returns 1.0 if a is less than or equal to b. Otherwise, it returns 0.0. \n\nExample: \nif(le($a, $b), "Red", "Green"); \nReturns Red if $a<=$b, and Green otherwise.',
      label: 'le(a, b)',
    },
    {
      info: 'Returns 1.0 if a and b are not equal. Otherwise, it returns 0.0. \n\nExample: \nif(ne($a, $b), "Red", "Green"); \nReturns Red if $a and $b are not equal, and Green otherwise.',
      label: 'ne(a, b)',
    },
    {
      info: 'Returns factorial n. \n\nExample: \nfact(4); \nReturns 24',
      label: 'fact(n)',
    },
    {
      info: 'Returns a string that expresses the fraction a/b in its lowest terms. \n\nExample: \nfrac(12, 15); \nReturns 4/5 \n\nExample: \nfrac(12, 3); \nReturns 4 \n\nTIP: frac(a,b) can be combined with mathml(s) to produce nicely typeset fractions.',
      label: 'frac(a, b)',
    },
    {
      info: 'Returns the greatest common divisor of a and b. \n\nExample: \ngcd(12, 15); \nReturns 3',
      label: 'gcd(a, b)',
    },
    {
      info: 'Returns 1.0 if a is greater than b (a > b). Otherwise, it returns 0.0. \n\nExample: \ngt(5, 2); \nReturns 1 \n\nExample: \ngt(2, 5); \nReturns 0 \n\nExample: \ngt(5, 5); \nReturns 0',
      label: 'gt(a, b)',
    },
    {
      info: 'Returns 1.0 if a is less than b (a < b). Otherwise, it returns 0.0. \n\nExample: \nlt(2, 5); \nReturns 1 \n\nExample: \nlt(5, 2); \nReturns 0 \n\nExample: \nlt(5, 5); \nReturns 0',
      label: 'lt(a, b)',
    },
    {
      info: 'If a is nonzero, it returns b. Otherwise, it returns c. \n\nExample: \nif(2, 4, 6); \nReturns 4 \n\nExample: \nif(0, 4, 6); \nReturns 6',
      label: 'if(a, b, c)',
    },
    {
      info: 'Returns the index of an item within a list based on the position stated by k (the first item is in position 0, the second in position 1, and so on). \n\nExample: \nindexof(3, 2, 3, 5, 7, 11); \nReturns 1 (because 3 is in position 1 of the list)',
      label: 'indexof(k, a, b, c, d, ...)',
    },
    {
      info: 'Passes the arguments a,b,c,d,.. to a custom Java™ evaluation engine and return the result. \n\nExample: \njava("com.mycompany.QuoteFunction", "AAPL") \nReturns a real-time quote for Apple Inc. stock (assuming that the class QuoteFunction had been suitably programmed).',
      label: 'java(cn, a, b, c, d, ...)',
    },
    {
      info: 'The least significant unit of x in the nth place. \n\nExample: \nlsu(3, 3.14159); \nReturns 0.01 (the unit in the third significant place). \n\nTIP: This operation is designed to be used when setting the tolerance for correct answers.',
      label: 'lsu(n, x)',
    },
    {
      info: 'Passes a string to the Maple™ kernel and returns the value of the last Maple™ line that was processed. \n\nExample: \nmaple("ithprime(12)"); \nReturns 37 (the 12th prime number) \n\nExample: \nmaple("diff(sin(x)*x, x)"); \nReturns cos(x)*x + sin(x)(the derivative of sin(x)*x with respect to x) \n\nExample: \nmaple("MapleTA:-Builtin:-decimal(1, 6.56)"); \nReturns 6.6 (rounds the number 6.56 to 1 decimal place). \n\nTIP: Check out Maple syntax from Maplesoft for a comprehensive list of available commands.',
      label: 'maple("...")',
    },
    {
      info: 'Returns a string consisting of the formula f typeset in MathML. \n\nExample: \nmathml("sin(x)"); \nReturns <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>sin</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></math> \n\nExample: \nmathml("frac(1,2)"); \nReturns <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow></math> \n\nTIP: This command is intended for advanced Maple™ users familiar with MathML.',
      label: 'mathml(f)',
    },
    {
      info: 'Returns the largest of the arguments. \n\nExample: \nmax(5, 2, 8, 3); \nReturns 8',
      label: 'max(a, b, c, d, ...)',
    },
    {
      info: 'Returns the smallest of the arguments. \n\nExample: \nmin(5, 2, 8, 3); \nReturns 2',
      label: 'min(a, b, c, d, ...)',
    },
    {
      info: 'Returns 1.0 if a is equal to 0.0. Otherwise, it returns 0.0. \n\nExample: \nnot(1); \nReturns 0 \n\nExample: \nnot(0); \nReturns 1',
      label: 'not(a)',
    },
    {
      info: 'Returns the value of x, formatted according to the template given by the string fmt. \n\nExample: \nnumfmt("#,##0.00", 12345.678); \nReturns 12,345.68',
      label: 'numfmt(fmt, x)',
    },
    {
      info: 'Uses Maple™ plotting features to graphically display data and mathematical expressions as plots. \n\nExample: \nplotmaple("plot(x^2, x=-5..5)"); \nGenerates a plot of the function x^2 over the range -5 to 5.',
      label: 'plotmaple("plotstatement,...")',
    },
    {
      info: 'Returns a random real number between m and n (inclusive). \n\nExample: \nrand(0, 1); \nReturns a random number between 0 and 1.',
      label: 'rand(m, n)',
    },
    {
      info: 'Generates a random integer in the range 1, ..., floor(n) (inclusive). \n\nExample: \nrange(10); \nReturns a random integer between 1 and 10.',
      label: 'range(n)',
    },
    {
      info: 'Generates a random integer in the range m, m+1,..., m+q (inclusive), where q is the floor of n-m. \n\nExample: \nrange(5, 10); \nReturns a random integer between 5 and 10.',
      label: 'range(m, n)',
    },
    {
      info: 'Generates a random integer in the range m, m+k, ..., m+q*k (inclusive), where q is the floor of (n-m)/k. \n\nExample: \nrange(0, 10, 2); \nReturns a random even number between 0 and 10.',
      label: 'range(m, n, k)',
    },
    {
      info: 'Generates a random integer in the range 0, ..., n-1 (inclusive). \n\nExample: \nrint(5); \nReturns a random integer between 0 and 4.',
      label: 'rint(n)',
    },
    {
      info: 'Generates a random integer in the range m, ..., n-1 (inclusive). \n\nExample: \nrint(5, 10); \nReturns a random integer between 5 and 9.',
      label: 'rint(m, n)',
    },
    {
      info: 'Generates a random integer in the range m, m+k, ..., m+q*k (inclusive), where q is the largest integer such that m+q*k<=n-k. \n\nExample: \nrint(0, 10, 2); \nReturns a random even number between 0 and 10.',
      label: 'rint(m, n, k)',
    },
    {
      info: 'Returns the nth largest element item from a list (numbering starts at 1). \n\nExample: \nrank(2, 5, 8, 3, 2, 7); \nReturns the 2nd largest element, which is 7.',
      label: 'rank(n, a, b, c, d, ...)',
    },
    {
      info: 'Returns the integer part of x. \n\nExample: \nint(5.67); \nReturns 5',
      label: 'int(x)',
    },
    {
      info: 'Returns x expressed as a floating-point number rounded to n decimal places through Maple. \n\nExample: \nmaple("MapleTA:-Builtin:-decimal(2, 6.567)"); \nReturns 6.57 (rounds the number 6.567 to 2 decimal places).',
      label: 'maple("MapleTA:-Builtin:-decimal(n, x)")',
    },
    {
      info: 'Returns x expressed as a floating-point number rounded to n significant digits through Maple. \n\nExample: \nmaple("MapleTA:-Builtin:-sig(3, 12345.6789)"); \nReturns 1.23e+04 (rounds the number 12345.6789 to 3 significant digits).',
      label: 'maple("MapleTA:-Builtin:-sig(n, x)")',
    },
    {
      info: 'Standard mathematical functions of x. \n\nExample: \nsin(30); \nReturns the sine of 30 degrees.',
      label: 'sin(x), cos(x), tan(x)',
    },
    {
      info: 'Computes the rth binomial coefficient of degree n. \n\nExample: \nbinomial(5, 2); \nReturns 10 (the number of ways to choose 2 items from a set of 5).',
      label: 'binomial(n, r)',
    },
    {
      info: 'Computes the cumulative probability for a standard normal distribution. \n\nExample: \nmaple("MapleTA[Builtin][erf](1.5)"); \nReturns the cumulative probability for a standard normal distribution with z=1.5.',
      label: 'maple("MapleTA[Builtin][erf](z)")',
    },
    {
      info: 'Returns x modulo p. \n\nExample: \nmaple("MapleTA:-Builtin:-modp(17, 5)"); \nReturns 2 (because 17 modulo 5 is 2).',
      label: 'maple("MapleTA:-Builtin:-modp(x, p)")',
    },
    {
      info: 'Returns the exponential function e^x. \n\nExample: \nexp(2); \nReturns e^2.',
      label: 'exp(x)',
    },
    {
      info: 'Returns the natural logarithm of x. \n\nExample: \nlog(10); \nReturns the natural logarithm of 10.',
      label: 'log(x)',
    },
    {
      info: 'Returns the absolute value of x. \n\nExample: \nabs(-5); \nReturns 5',
      label: 'abs(x)',
    },
    {
      info: 'Returns the square root of x. \n\nExample: \nsqrt(25); \nReturns 5',
      label: 'sqrt(x)',
    },
    {
      info: 'Rounds x to the nearest integer. \n\nExample: \nround(5.67); \nReturns 6',
      label: 'round(x)',
    },
    {
      info: 'Rounds x up to the nearest integer. \n\nExample: \nceil(5.01); \nReturns 6',
      label: 'ceil(x)',
    },
    {
      info: 'Rounds x down to the nearest integer. \n\nExample: \nfloor(5.99); \nReturns 5',
      label: 'floor(x)',
    },
    {
      info: 'Hyperbolic functions of x. \n\nExample: \nsinh(1); \nReturns the hyperbolic sine of 1.',
      label: 'sinh(x)',
    },
    {
      info: 'Hyperbolic functions of x. \n\nExample: \ncosh(1); \nReturns the hyperbolic cosine of 1.',
      label: 'cosh(x)',
    },
    {
      info: 'Hyperbolic functions of x. \n\nExample: \ttanh(1); \nReturns the hyperbolic tangent of 1.',
      label: 'tanh(x)',
    },
    {
      info: 'Inverse trigonometric functions of x. \n\nExample: \nasin(1); \nReturns the arcsine of 1.',
      label: 'asin(x)',
    },
    {
      info: 'Inverse trigonometric functions of x. \n\nExample: \nacos(1); \nReturns the arccosine of 1.',
      label: 'acos(x)',
    },
    {
      info: 'Inverse trigonometric functions of x. \n\nExample: \natan(1); \nReturns the arctangent of 1.',
      label: 'atan(x)',
    },
    {
      info: 'Trigonometric functions of x where x is in degrees. \n\nExample: \nsindeg(30); \nReturns the sine of 30 degrees.',
      label: 'sindeg(x)',
    },
    {
      info: 'Trigonometric functions of x where x is in degrees. \n\nExample: \ncosdeg(30); \nReturns the cosine of 30 degrees.',
      label: 'cosdeg(x)',
    },
    {
      info: 'Trigonometric functions of x where x is in degrees. \n\nExample: \ntandeg(30); \nReturns the tangent of 30 degrees.',
      label: 'tandeg(x)',
    },
    {
      info: 'Inverse trigonometric functions of x where x is in degrees. \n\nExample: \nasindef(1); \nReturns the arcsine of 1.',
      label: 'asindeg(x)',
    },
    {
      info: 'Inverse trigonometric functions of x where x is in degrees. \n\nExample: \nacos(1); \nReturns the arccosine of 1.',
      label: 'acosdeg(x)',
    },
    {
      info: 'Inverse trigonometric functions of x where x is in degrees. \n\nExample: \natan(1); \nReturns the arctangent of 1.',
      label: 'atandeg(x)',
    },
    {
      info: 'Computes the derivative of f with respect to x. \n\nExample: \nderivative("x^2", "x"); \nReturns 2*x (the derivative of x^2 with respect to x).',
      label: 'derivative(f, x)',
    },
    {
      info: 'Computes the limit of f as x approaches a from the specified direction. \n\nExample: \nlimit("1/x", "x", 0, "right"); \nReturns +infinity (the limit of 1/x as x approaches 0 from the right).',
      label: 'limit(f, x, a, direction)',
    },
    {
      info: 'Solves the equation for the specified variable. \n\nExample: \nsolve("x^2 - 4 = 0", "x"); \nReturns [-2, 2] (the solutions to the equation x^2 - 4 = 0).',
      label: 'solve(equation, variable)',
    },
    {
      info: 'Computes the sum of expr as var ranges from start to end. \n\nExample: \nsum("x^2", "x", 1, 3); \nReturns 14 (the sum of x^2 as x ranges from 1 to 3).',
      label: 'sum(expr, var, start, end)',
    },
    {
      info: 'Computes the product of expr as var ranges from start to end. \n\nExample: \nproduct("x", "x", 1, 3); \nReturns 6 (the product of x as x ranges from 1 to 3).',
      label: 'product(expr, var, start, end)',
    },
    {
      info: 'Computes the definite integral of expr with respect to var from start to end. \n\nExample: \nintegral("x^2", "x", 0, 1); \nReturns 1/3 (the definite integral of x^2 with respect to x from 0 to 1).',
      label: 'integral(expr, var, start, end)',
    },
  ].map((val) => ({ ...val, section: 'Function', type: 'function' }))
  const extra: Completion[] = [
    snippetCompletion('condition: ${x};', { label: 'condition: x;' }),
    snippetCompletion('$${variable} = "${string}";', {
      label: '$variable = "string";',
      section: 'Declaration',
    }),
    snippetCompletion('$${variable} = ${number};', { label: '$variable = number;', section: 'Declaration' }),
    ...main.map((elem) =>
      snippetCompletion('$${variable} = ' + `${elem.label};`, {
        ...elem,
        label: `$variable = ${elem.label};`,
        section: 'Declaration',
      }),
    ),
  ]

  return [...main, ...extra]
}

export class Utils {
  /**
   * A static array of all the selectors in all the stylesheets in the document.
   */
  static selectors: string[];
  /**
   * Checks if a class is defined in the document's stylesheets.
   * @param className The name of the class to check.
   * @returns True if the class is defined, false otherwise.
   */
  static isClassDefined(className: string): boolean {
    if (!Utils.selectors) {
      Utils.selectors = Array.from(document.styleSheets) // Get all of the style sheets
        .reduce((agg: CSSRule[], cur: StyleSheet) => [...agg, ...Array.from((cur as CSSStyleSheet).cssRules)], []) // reduce to the rules
        .filter(rule => rule.constructor.name === 'CSSStyleRule') // further filter to the style rules (as opposed to media rules, etc.)
        .map(rule => (rule as CSSStyleRule).selectorText); // then just get the selectors
    }
    return Utils.selectors.includes(`.${className}`) || // then return true if the class selector on its own is there, or
      Utils.selectors.some(selector => selector.includes(`.${className}`)); // it's used in combination with another; NB: this could produce
      // false positives if the class name is a substring of another class name, but that is unlikely to happen in practice.
  }
  /**
   * Defines a CSS class in the document's stylesheets.
   * @param className The name of the class to define.
   * @param cssText The CSS text to apply to the class.
   * @description This method creates a new `<style>` element, sets its `textContent` to the CSS rule for the class, and appends it to the document's `<head>`.
   */
  static defineClass(className: string, cssText: string): void {
    const style = document.createElement('style');
    style.textContent = `.${className} { ${cssText} }`;
    document.head.appendChild(style);
    Utils.selectors.push(`.${className}`);
  }
  /**
   * Redefines a CSS class in the document's stylesheets.
   * @param className The name of the class to redefine.
   * @param cssText The CSS text to apply to the class.
   * @description This method checks if the class is already defined, and if so, removes the existing style rule before defining the new one.
   * If the class is not defined, it simply calls `Utils.defineClass`.
   */
  static redefineClass(className: string, cssText: string): void {
    if (Utils.isClassDefined(className)) {
      const styleSheet = Array.from(document.styleSheets)
        .filter((ss: StyleSheet) => !!(ss as CSSStyleSheet).cssRules)
        .find((ss: CSSStyleSheet) => Array.from(ss.cssRules)
          .filter(rule => rule.constructor.name === 'CSSStyleRule')
          .find(rule => (rule as CSSStyleRule).selectorText === `.${className}`) != null);
      if (typeof styleSheet === 'undefined') {
        throw new Error(`StyleSheet for class ${className} not found.`);
      }
      const ssNode = styleSheet.ownerNode;
      if (ssNode?.parentNode == null) {
        throw new Error(`StyleSheet owner node for class ${className} not found.`);
      }
      ssNode.parentNode.removeChild(ssNode);
    }
    Utils.defineClass(className, cssText);
  }
}

// Name of the webpage to use for localStorage
const localStorageName = 'multivar_';
// Mathjax loading
const initialElementsToTypeset = ['updateHistory', 'what', 'links', 'whyCalc', 'credits', 'progress2', 'progress8', 'progress10'];
var typesetElements = initialElementsToTypeset.slice();

function mathjaxPageReady() {
  if (elementsExist('drawingBoard')) {
    MathJax.typeset();
  }
  else {
    get('loading').innerText = '';
    for (var elementID of initialElementsToTypeset) {
      if (elementsExist(elementID)) {
        MathJax.typeset([get(elementID)]);
      }
    }
    for (var unit of unitsToTypeset) {
      typesetUnit(unit);
    }
  }
}

MathJax = {
  chtml: {
    // Set the display of MathJax equations
    displayAlign: 'left',
    minScale: 1.25,
    matchFontHeight: false
  },
  startup: {
    ready: () => {
      get('loading').innerText = 'Loading math expressions... Some features will not work properly until loading finishes.';
      setTimeout(() => MathJax.startup.defaultReady());
      MathJax.startup.promise.then(mathjaxPageReady);
    },
    typeset: false
  },
  loader: {
    load: ['ui/lazy', '[tex]/physics']
  },
  options: {
    lazyMargin: '500px'
  },
  tex: {
    packages: {'[+]': ['physics']}
  }
};

function slowPartialSum(func) {
  // Returns a function that manually calculates the partial sum. It's slow so only use when you can't find an expression for the partial sum.
  return n => {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
      sum += func(i);
    }
    return sum;
  }
}

function factorial(n) {
  var result = 1;
  for (var i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}

function isComplex(num) {
  return math.typeOf(num) === 'Complex';
}

// Custom text for show/hide buttons. Defaults to "Show" / "Hide" if not specified
const customTextButtons = {
  'progress': {
    'showText': 'Show Current Progress',
    'hideText': 'Hide Current Progress'
  },
  'otherSites': {
    'showText': 'Show Other Sites',
    'hideText': 'Hide Other Sites'
  },
  'introPopup': {
    'showText': 'Show Intro Popup',
    'hideText': 'Hide Intro Popup'
  },
  'personalStory': {
    'showText': 'Show Personal Story',
    'hideText': 'Hide Personal Story'
  },
  'determinantExplanation': {
    'showText': 'What is a matrix? What is a determinant?',
    'hideText': 'Hide Explanation'
  }
};

const sliderSettings = {
  '2dVectorLineInteractive': {
    'func': t => 3 * t - 1,
    'sliderRange': [-1, 3]
  },
  'dotProduct': {
    'func': x => Math.cos(x),
    'sliderRange': [0, 2 * Math.PI],
    'inputPlaces': 2,
    'outputPlaces': 2
  },
  'partialDiffX': {
    'func': x => x ** 2 * 2,
    'sliderRange': [-10, 10]
  },
  'partialDiffY': {
    'func': y => 4 * y,
    'sliderRange': [-10, 10]
  },
  'multivarFunc1': {
    'func': x => x ** 2,
    'sliderRange': [-10, 10]
  },
  'multivarFunc2X': {
    'sliderRange': [-10, 10]
  },
  'multivarFunc2Y': {
    'sliderRange': [-10, 10]
  },
  'multivarFunc3X': {
    'sliderRange': [-10, 10]
  },
  'multivarFunc3Y': {
    'sliderRange': [-10, 10]
  },
  'multivarFunc3Z': {
    'sliderRange': [-10, 10]
  },
  'linearApproxX': {
    'sliderRange': [0.5, 1.5]
  },
  'linearApproxY': {
    'sliderRange': [0.5, 1.5]
  }
};

const sequenceSettings = {
  // Sequence displayers and partial sum sliders
};

const graphSettings = {
  // Canvas graphs
  '2dVectorLine': {
    'func': t => 3 * t - 1,
    'derivative': t => 3,
    'xBounds': [-2.1, 4.1],
    'yBounds': [-0.1, 6.1]
  },
  '2dVectorLineInteractive': {
    'func': t => 3 * t - 1,
    'derivative': t => 3,
    'xBounds': [-2.1, 4.1],
    'yBounds': [-0.1, 6.1]
  },
  'dotProduct': {
    'xBounds': [-1.25, 1.25],
    'yBounds': [-1.25, 1.25]
  }
};

const taylorFuncs = {

};

// Initialize canvas and ctx variables for each graph
for (var id in graphSettings) {
  var canvas = get(id + 'Canvas');
  if (canvas !== null) {
    graphSettings[id]['canvas'] = canvas;
    graphSettings[id]['ctx'] = canvas.getContext('2d');
  }
}

// I use this variable during debugging to count how many times a function is called
var counter = 0;

// Helper functions
function get(element) {
  return document.getElementById(element);
}

function getClassElements(classNames) {
  // classNames can be an array or a single class name
  if (!Array.isArray(classNames)) {
    classNames = [classNames];
  }
  var classElements = [];
  for (var className of classNames) {
    for (var element of document.getElementsByClassName(className)) {
      classElements.push(element);
    }
  }
  return classElements;
}

function localStorageGet(key) {
  return localStorage.getItem(localStorageName + key);
}

function localStorageSet(key, value) {
  return localStorage.setItem(localStorageName + key, value);
}

// Returns whether the given elements exist
function elementsExist(ids) {
  // ids can be an array or a single element id
  if (!Array.isArray(ids)) {
    // Single element
    return get(ids) !== null;
  }
  // Array of elements
  for (var id of ids) {
    if (get(id) === null) {
      return false;
    }
  }
  return true;
}

function removeFromArray(array, value) {
  // Returns whether or not a value was actually removed
  var index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
}

function coloredText(color, text) {
  if (darkModeEnabled) {
    return `<span class="${color}-dark-mode">${text}</span>`;
  }
  return `<span class="${color}">${text}</span>`;
}

function setText(id, text) {
  if (elementsExist(id)) {
    get(id).innerText = text;
  }
}

// Functions that handle hiding and showing elements
function isHidden(element) {
  var classList = get(element).classList;
  return classList.contains('hidden') || classList.contains('hidden-by-default');
}

function jumpTo(element) {
  if (!elementsExist(element)) {
    return;
  }
  var header = element + 'Header';
  var parentElement = get(element).parentElement;
  var unit = parentElement.id;
  if (parentElement.tagName !== 'BODY' && !get(unit).classList.contains('unit')) {
    // This is VERY counterintuitive but we only want to show the unit if it isn’t the parent element containing both the unit and the header
    // This allows the function to work with entire units, not just sections
    showElement(unit);
  }
  if (unitElementIDs.includes(unit + 'Unit')) {
    typesetUnit(unit);
  }
  else if (unitElementIDs.includes(unit)) {
    typesetUnit(unit.replace(/Unit$/, ''));
  }
  showElement(element);
  if (elementsExist(header)) {
    get(header).scrollIntoView();
  }
  else {
    get(element).scrollIntoView();
  }
}

function saveHiddenElements() {
  localStorageSet('hiddenElements', JSON.stringify(hiddenElements));
}

function saveShownElements() {
  localStorageSet('shownElements', JSON.stringify(shownElements));
}

function getSectionsInUnit(unit) {
  var sections = [];
  for (var element of get(unit).querySelectorAll(':scope > div')) {
    if (element.id !== '') {
      sections.push(element.id);
    }
  }
  return sections;
}

function showElement(element, button=null, hideText='Hide', save=true) {
  if (button === null) {
    button = element + 'Button';
  }
  
  if (get(element) === null) {
    // Element doesn't exist; something went wrong
    return;
  } 

  get(element).classList.remove('hidden', 'hidden-by-default', 'hidden-until-load');
  typesetElement(element);

  if (get(button) !== null) {
    get(button).innerText = hideText;
  }

  if (!elementsHiddenByDefault.includes(element) && removeFromArray(hiddenElements, element) && save) {
    saveHiddenElements();
  }
  else if (elementsHiddenByDefault.includes(element) && !shownElements.includes(element)) {
    shownElements.push(element);
    if (save) {
      saveShownElements();
    }
  }
}

function hideElement(element, button=null, showText='Show', save=true) {
  if (button === null) {
    button = element + 'Button';
  }
  
  if (get(element) === null) {
    // Element doesn't exist; something went wrong
    return;
  }
  
  get(element).classList.add('hidden');

  if (get(button) !== null) {
    get(button).innerText = showText;
  }

  if (!elementsHiddenByDefault.includes(element) && !hiddenElements.includes(element)) {
    hiddenElements.push(element);
    if (save) {
      saveHiddenElements();
    }
  }
  else if (elementsHiddenByDefault.includes(element) && removeFromArray(shownElements, element) && save) {
    saveShownElements();
  }
}

function showElements(elements, index=0) {
  // This function prevents lag by recursively calling itself, showing the elements one by one
  // If I use a for loop, browsers will try to show all of the elements at the same time, causing a bit of lag
  if (index < elements.length) {
    showElement(elements[index], null, 'Hide', false);
    setTimeout(() => showElements(elements, index + 1));
  }
  else {
    saveShownElements();
    saveHiddenElements();
  }
}

function showHide(element, button=null, save=true) {
  if (element in customTextButtons) {
    var showText = customTextButtons[element]['showText'];
    var hideText = customTextButtons[element]['hideText'];
  }
  else {
    var showText = 'Show';
    var hideText = 'Hide';
  }

  if (isHidden(element)) {
    showElement(element, button, hideText, save);
  }
  else {
    hideElement(element, button, showText, save);
  }
  updateFooter();
}

var typesetUnits = [];
function typesetUnit(unitElement) {
  // Typeset Mathjax for unit
  unitElement = unitElement.replace(/Unit$/, '');
  if (!typesetUnits.includes(unitElement) && 'typeset' in MathJax) {
    var unitHeaders = get(unitElement).getElementsByClassName('section-header');
    for (var header of unitHeaders) {
      MathJax.typeset([header]);
      var sectionID = header.id.replace(/Header$/, '');
      if (!isHidden(sectionID)) {
        typesetElement(sectionID);
      }
    }
    typesetUnits.push(unitElement);
  }
}

function typesetElement(elementID) {
  if (elementsExist('drawingBoard')) {
    return;
  }
  if (!('typeset' in MathJax)) {
    return;
  }
  if (typesetElements.includes(elementID) || unitElementIDs.includes(elementID + 'Unit')) {
    return;
  }
  MathJax.typeset([get(elementID)]);
  typesetElements.push(elementID);
}

function showUnit(unitElement, button=null, hideText='Hide') {
  if (!isHidden(unitElement)) {
    return;
  }

  var nonHiddenElements = [];
  for (var section of getSectionsInUnit(unitElement)){
    if (!isHidden(section)) {
      nonHiddenElements.push(section);
    }
    hideElement(section, null, 'Show', false);
  }
  showElement(unitElement, button, hideText, false);
  showElements(nonHiddenElements);
  typesetUnit(unitElement);
}

function showHideUnit(unitElement, button=null, showText='Show', hideText='Hide') {
  if (isHidden(unitElement)) {
    showUnit(unitElement, button, hideText);
  }
  else {
    hideElement(unitElement, button, showText);
  }
  updateFooter();
}

function toggleAllSections(unit, mode) {
  var sections = getSectionsInUnit(unit);
  if (mode === 'show') {
    showElements(sections);
  }
  else if (mode === 'hide') {
    for (var element of sections) {
      hideElement(element, null, 'Show', false);
    }
    saveShownElements();
  } 
}

function getCurrentUnit() {
  var unitsToCheck = unitElementIDs.slice();
  if (currentUnit !== null) {
    // Check the current unit first; this is faster in most cases since the unit is most likely not going to change when you scroll
    unitsToCheck.unshift(currentUnit);
  }
  for (var elementID of unitsToCheck) {
    var element = get(elementID);
    var rect = element.getBoundingClientRect();
    var viewHeight = window.innerHeight - footer.offsetHeight;
    if (rect.top <= viewHeight && rect.bottom >= viewHeight) {
      return element.id;
    }
  }
}

// Number formatting functions
function round(number, places=0) {
  return math.round(number, places);
}

var largeNumFormat = 'default';
const sciNotDecimals = 5;
const sciNotThresholdHigh = 1e14;
const sciNotThresholdLow = 1e-10

// Returns whether to use scientific notation for a given number
function useScientificNotation(number) {
  if (isComplex(number)) {
    return false;
  }
  var absNumber = Math.abs(number);
  return absNumber >= sciNotThresholdHigh || absNumber < sciNotThresholdLow && absNumber > 0;
}

function formatRealNum(number, places=0, maxSigFigs=null) {
  if (!isFinite(number)) {
    return 'undefined';
  }

  if (maxSigFigs !== null) {
    var digitsInNumber = Math.floor(Math.log10(Math.abs(number))) + 1;
    places = Math.max(0, Math.min(places, maxSigFigs - digitsInNumber));
  }

  var absNumber = Math.abs(number);
  if (absNumber >= 1000) {
    // Add commas to number
    var parts = absNumber.toFixed(places).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var absNumberString = parts.join('.');
  }
  else {
    var absNumberString = absNumber.toFixed(places);
  }

  if (useScientificNotation(number)) {
    // Handle scientific notation
    if (largeNumFormat.endsWith('Engineering')) {
      var exponent = Math.floor(Math.log10(absNumber)) - Math.floor(Math.log10(absNumber)) % 3;
      var mantissa = round(absNumber / 10 ** exponent, sciNotDecimals);
    }
    else {
      var exponent = Math.floor(Math.log10(absNumber));
      var mantissa = round(absNumber / 10 ** exponent, sciNotDecimals);
    }
    if (largeNumFormat === 'e' || largeNumFormat == 'eEngineering') {
      absNumberString = `${mantissa}e${exponent}`;
    }
    else {
      if (exponent >= 0) {
        absNumberString = `${mantissa} × 10^${exponent}`;
      }
      else {
        absNumberString = `${mantissa} × 10^(${exponent})`;
      }
    }
  }
  else if (absNumberString.includes('.')) {
    // Remove trailing zeros from decimals
    absNumberString = absNumberString.replace(/\.*0+$/, '');
  }

  if (number < 0) {
    return '-' + absNumberString;
  }
  return absNumberString;
}

function formatNum(number, places=0, maxSigFigs=null, nonBreakingLength=null, nonBreakingSide='right') {
  number = round(number, places);
  if (isComplex(number)) {
    if (number.re === 0) {
      if (number.im === -1) {
        return '-i';
      }
      else if (number.im === 1) {
        return 'i';
      }
      else {
        return formatNum(number.im, places) + 'i';
      }
    }
    var realStr = formatRealNum(number.re, places, maxSigFigs);
    // imagStr is the absolute value of the imaginary part formatted to a string
    var imagStr = formatRealNum(Math.abs(number.im), places, maxSigFigs);
    if (Math.abs(number.im) === 1) {
      imagStr = '';
    }

    if (number.im === 0) {
      var string = realStr;
    }
    else if (number.im > 0) {
      var string = `${realStr} + ${imagStr}i`;
    }
    else {
      var string = `${realStr} - ${imagStr}i`;
    }
  }
  else {
    var string = formatRealNum(number, places, maxSigFigs);
  }

  if (nonBreakingLength !== null) {
    // Add non-breaking spaces until number reaches length
    // Used to make tables not as shaky when values change
    if (nonBreakingSide === 'left') {
      string = '\xa0'.repeat(Math.max(nonBreakingLength - string.length, 0)) + string;
    }
    else {
      string += '\xa0'.repeat(Math.max(nonBreakingLength - string.length, 0));
    }
  }
  return string;
}

// Riemann sum functions
function riemannSumLoop(func, x, width, runs) {
  var totalHeight = 0;
  for (var i = 0; i < runs; i++) {
    totalHeight += func(x);
    x += width;
  }
  return totalHeight;
}

// For Riemann sums with displayProgress enabled
function riemannOutput(id, rectangles, area) {
  get(id + 'Val1').innerText = formatNum(rectangles);
  get(id + 'Val2').innerText = formatNum(area, 7);
}

var riemannTimeout = null;
function riemannSum(func, interval, rectangles, sumType, displayProgress=false, chunkSize=1e6, id=null) {
  var progressID = id + 'Progress';
  clearTimeout(riemannTimeout);
  if (displayProgress && rectangles < chunkSize * 2) {
    get(progressID).innerText = '';
  }

  var start = interval[0];
  var end = interval[1];
  var totalHeight = 0;
  var width = (end - start) / rectangles;

  if (sumType === 'right') {
    var x = start + width;
  }
  else if (sumType === 'left') {
    var x = start;
  }
  else if (sumType === 'midpoint') {
    var x = start + width / 2;
  }
  else if (sumType === 'trapezoid') {
    var x = start;
    var a = null;
    var b = func(x);
    for (var i = 0; i < rectangles; i++) {
      a = b;
      x += width;
      b = func(x);
      totalHeight += (a + b) / 2;
    }
    return totalHeight * width;
  }
  
  if (displayProgress) {
    if (rectangles > chunkSize * 2) {
      // Calculate chunkSize rectangles at once instead of all at once
      // This is for the progress display to work
      var progressElement = get(progressID);
      function calculateChunk(i=0) {
        progressElement.innerText = `Calculating area... (${formatNum(i * chunkSize)} / ${formatNum(rectangles)})`;
        if (i >= Math.floor(rectangles / chunkSize)) {
          totalHeight += riemannSumLoop(func, x, width, rectangles % chunkSize);
          progressElement.innerText = '';
          riemannOutput(id, rectangles, totalHeight * width);
          return;
        }
        totalHeight += riemannSumLoop(func, x, width, chunkSize);
        x += chunkSize * width;
        riemannTimeout = setTimeout(() => calculateChunk(i + 1));
      }
      calculateChunk();
    }
    else {
      riemannOutput(id, rectangles, riemannSumLoop(func, x, width, rectangles) * width);
    }
  }
  else {
    return riemannSumLoop(func, x, width, rectangles) * width;
  }
}

// Sequence and series functions
const termsToDisplay = 5; // How many terms are displayed at one time for each sequence
function displaySequence(element) {
  if (!elementsExist(element + 'Seq')) {
    return;
  }
  var terms = [];
  var rule = sequenceSettings[element]['rule'];
  var start = sequenceStates[element];
  for (var i = start; i < start + termsToDisplay; i++) {
    terms.push(formatNum(rule(i), sequenceSettings[element]['places']));
  }
  if (start === 1) {
    var termStr = terms.join(', ') + '...';
  }
  else {
    var termStr = '...' + terms.join(', ') + '...';
  }
  get(element + 'Seq').innerText = termStr;
}

function prevTerm(element) {
  var index = sequenceStates[element];
  if (index === 1) {
    return;
  }
  sequenceStates[element]--;
  displaySequence(element);
}

function nextTerm(element) {
  sequenceStates[element]++;
  displaySequence(element);
}

function formatSeriesTerm(term, places, maxSigFigs, displayAsFraction, returnRegularTerm, termDisplayRule, n) {
  if (termDisplayRule !== null) {
    var numStr = termDisplayRule(n);
    if (returnRegularTerm) {
      // remove leading +
      return numStr.replace(/^\+/, '');
    }
    else {
      // add spaces to leading + or -
      return numStr.replace(/^\+/, ' + ').replace(/^\-/, ' - ');
    }
  }
  else if (displayAsFraction) {
    if (useScientificNotation(1 / Math.abs(term))) {
      var numStr = `1/(${formatNum(1 / Math.abs(term), 3)})`;
    }
    else {
      var numStr = `1/${formatNum(1 / Math.abs(term), 3)}`;
    }
  }
  else {
    var numStr = formatNum(Math.abs(term), places, maxSigFigs);
  }
  if (returnRegularTerm) {
    return term >= 0 ? numStr : '-' + numStr;
  }
  if (term >= 0) {
    return ` + ${numStr}`;
  }
  return ` - ${numStr.replace('-', '')}`;
}

function displayPartialSum(id, func, partialSumFunc, terms, places=0, displayAsFraction=false, endingTerms=1, termDisplayRule=null, maxSigFigs=null) {
  // endingTerms: Terms to display at the end of the sum
  // termDisplayRule: Custom rule for displaying each term (e.g. factorials in denominators)
  // Max terms to display in full (any more will cause some terms to be omitted)
  const maxTerms = 6;
  var sumText = formatSeriesTerm(func(1), places, maxSigFigs, displayAsFraction, true, termDisplayRule, 1); // first term of series
  // First (maxTerms - endingTerms - 1) terms
  for (var n = 2; n <= Math.min(terms, maxTerms - endingTerms - 1); n++) {
    sumText += formatSeriesTerm(func(n), places, maxSigFigs, displayAsFraction, false, termDisplayRule, n);
  }
  if (terms <= maxTerms) {
    for (var n = maxTerms - endingTerms; n <= terms; n++) {
      sumText += formatSeriesTerm(func(n), places, maxSigFigs, displayAsFraction, false, termDisplayRule, n);
    }
  }
  else {
    if (func(maxTerms - endingTerms) >= 0) {
      sumText += ' + ... ';
    }
    else {
      sumText += ' - ... ';
    }
    for (var n = terms - endingTerms + 1; n <= terms; n++) {
      sumText += formatSeriesTerm(func(n), places, maxSigFigs, displayAsFraction, false, termDisplayRule, n);
    }
  }

  var partialSum = partialSumFunc(terms);
  if (useScientificNotation(partialSum)) {
    var exponent = Math.floor(Math.log10(Math.abs(partialSum)));
    var mantissa = round(Math.abs(partialSum) / 10 ** exponent, sciNotDecimals);
    var displayedValue = mantissa * 10 ** exponent;
  }
  else {
    var displayedValue = round(partialSum, places);
  }
  if (math.equal(round(partialSum, 14), displayedValue)) {
    sumText += ' = ';
  }
  else {
    sumText += ' ≈ ';
  }
  sumText += formatNum(partialSum, places, maxSigFigs);
  get(id + 'Sum').innerText = sumText;
}

// Canvas graph functions
function xyToCoords(x, y, xBounds, yBounds, width, height) {
  return [(x - xBounds[0]) / (xBounds[1] - xBounds[0]) * width, (1 - (y - yBounds[0]) / (yBounds[1] - yBounds[0])) * height];
}

function updateCanvasSize(canvas) {
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  if (width === 0) {
    // min(90vw, 400px)
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    width = Math.round(Math.min(viewportWidth * 0.9, 400));
    if (canvas.classList.contains('canvas-graph')) {
      height = width;
    }
    else if (canvas.classList.contains('short-canvas-graph')) {
      height = width / 4;
    }
  }

  if (canvas.width !== width && width !== 0) {
    canvas.width = width;
  }
  if (canvas.height !== height && height !== 0) {
    canvas.height = height;
  }
}

function drawAxes(config, width, height, noYAxis=false, labelXAxis=false) {
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  ctx.lineWidth = 2;
  ctx.strokeStyle = darkModeEnabled ? '#f3f3f3' : 'black';
  if (xBounds[0] < 0 && xBounds[1] > 0 && !noYAxis) {
    var yAxisCoord = xyToCoords(0, 0, xBounds, yBounds, width, height)[0];
    ctx.beginPath();
    ctx.moveTo(yAxisCoord, 0);
    ctx.lineTo(yAxisCoord, height);
    ctx.stroke();
  }
  
  if (yBounds[0] < 0 && yBounds[1] > 0) {
    var xAxisCoord = xyToCoords(0, 0, xBounds, yBounds, width, height)[1];
    ctx.beginPath();
    ctx.moveTo(0, xAxisCoord);
    ctx.lineTo(width, xAxisCoord);
    ctx.stroke();
    if (labelXAxis) {
      ctx.font = "25px Arial";
      ctx.fillStyle = darkModeEnabled ? '#f3f3f3' : 'black';
      ctx.textAlign = 'left';
      ctx.fillText(formatNum(xBounds[0], 1), 0, xAxisCoord - 10);
      ctx.textAlign = 'right';
      ctx.fillText(formatNum(xBounds[1], 1), width, xAxisCoord - 10);
    }
  }
}

function initializeGraph(config, noYAxis=false, labelXAxis=false) {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  updateCanvasSize(canvas);
  var width = canvas.width;
  var height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  drawAxes(config, width, height, noYAxis, labelXAxis);
}

function canvasGraph(config, func, color='red', clear=true, asymptote=null) {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  if (clear) {
    ctx.clearRect(0, 0, width, height);
    drawAxes(config, width, height);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

  var coords = xyToCoords(xBounds[0], func(xBounds[0]), xBounds, yBounds, width, height);  
  var startXPos = coords[0];
  var startYPos = coords[1];

  // Canvas breaks with large numbers so let's limit startYPos to between -height and 2 * height
  if (startYPos > 2 * height) {
    startYPos = 2 * height;
  }
  else if (startYPos < -height) {
    startYPos = -height;
  }

  ctx.beginPath();
  ctx.moveTo(startXPos, startYPos);

  var lastXPos = startXPos;
  var pixelWidth = (xBounds[1] - xBounds[0]) / width;
  
  for (var pixel = 1; pixel <= width; pixel++) {
    var x = (pixel / width) * (xBounds[1] - xBounds[0]) + xBounds[0];
    var y = func(x);
    var coords = xyToCoords(x, y, xBounds, yBounds, width, height);
    var nextXPos = coords[0];
    var nextYPos = coords[1];
    if (nextYPos > 2 * height) {
      nextYPos = 2 * height;
    }
    else if (nextYPos < -height) {
      nextYPos = -height;
    }
    if (isFinite(y)) {
      var isAsymptote = asymptote !== null && x >= asymptote && x <= asymptote + pixelWidth;
      if (lastXPos !== null && !isAsymptote) {
        ctx.lineTo(nextXPos, nextYPos);
      }
      else {
        ctx.moveTo(nextXPos, nextYPos);
      }
      lastXPos = nextXPos;
    }
    else {
      lastXPos = null;
    }
  }
  ctx.stroke();
}

function shadeGraph(config, func, leftX, rightX, color='pink') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.fillStyle = color;

  if (leftX < xBounds[0]) {
    leftX = xBounds[0];
  }
  if (rightX > xBounds[1]) {
    rightX = xBounds[1];
  }
  // point (leftX, 0)
  var leftCoords = xyToCoords(leftX, 0, xBounds, yBounds, width, height);
  // point (rightX, 0)
  var rightCoords = xyToCoords(rightX, 0, xBounds, yBounds, width, height);
  
  ctx.beginPath();
  ctx.moveTo(leftCoords[0], leftCoords[1]);
  var pixelsToDraw = Math.round(rightCoords[0] - leftCoords[0]);

  var coords = xyToCoords(leftX, func(leftX), xBounds, yBounds, width, height);
  var lastXPos = coords[0];
  var lastYPos = coords[1];
  ctx.lineTo(lastXPos, lastYPos);

  for (var pixel = 1; pixel <= pixelsToDraw; pixel++) {
    var x = (pixel / pixelsToDraw) * (rightX - leftX) + leftX;
    var y = func(x);
    var coords = xyToCoords(x, y, xBounds, yBounds, width, height);
    var nextXPos = coords[0];
    var nextYPos = coords[1];
    if (isFinite(y)) {
      if (lastXPos !== null) {
        ctx.lineTo(nextXPos, nextYPos);
      }
      lastXPos = nextXPos;
      lastYPos = nextYPos;
    }
    else {
      lastXPos = null;
      lastYPos = null;
    }
  }
  
  ctx.lineTo(rightCoords[0], rightCoords[1]);
  ctx.lineTo(leftCoords[0], leftCoords[1]);
  ctx.closePath();
  ctx.fill();
}

function plotVerticalLine(config, x, color='red') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  var lineX = xyToCoords(x, 0, xBounds, yBounds, width, height)[0];
  ctx.beginPath();
  ctx.moveTo(lineX, 0);
  ctx.lineTo(lineX, height);
  ctx.stroke();
}

function plotLine(config, x1, y1, x2, y2, color='red') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  var firstPoint = xyToCoords(x1, y1, xBounds, yBounds, width, height);
  var secondPoint = xyToCoords(x2, y2, xBounds, yBounds, width, height);
  ctx.beginPath();
  ctx.moveTo(firstPoint[0], firstPoint[1]);
  ctx.lineTo(secondPoint[0], secondPoint[1]);
  ctx.stroke();
}

function plotVector(config, x1, y1, x2, y2, color='red', length=0.3, arrowAngle=Math.PI / 6) {
  var vectorAngle = Math.atan2(y2 - y1, x2 - x1);
  var leftHeadSlope = Math.tan(vectorAngle - arrowAngle);
  var rightHeadSlope = Math.tan(vectorAngle + arrowAngle);
  var leftHeadXLength = length * Math.cos(vectorAngle - arrowAngle);
  var rightHeadXLength = length * Math.cos(vectorAngle + arrowAngle);
  plotLine(config, x1, y1, x2, y2, color);
  plotLine(config, x2 - leftHeadXLength, y2 - leftHeadSlope * leftHeadXLength, x2, y2, color);
  plotLine(config, x2 - rightHeadXLength, y2 - rightHeadSlope * rightHeadXLength, x2, y2, color);
}

function plotCircle(config, radius, color='red') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  var circleCoords = xyToCoords(0, 0, xBounds, yBounds, width, height);
  var circleRadius = radius / (xBounds[1] - xBounds[0]) * width;
  ctx.beginPath();
  ctx.arc(circleCoords[0], circleCoords[1], circleRadius, 0, 2 * Math.PI);
  ctx.stroke();
}

function plotUnitHyperbola(config, color='red') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

  // Right side of hyperbola
  var coords = xyToCoords(Math.sqrt(1 + yBounds[0] ** 2), yBounds[0], xBounds, yBounds, width, height);
  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1])
  for (var pixel = 1; pixel <= height; pixel++) {
    var y = (pixel / height) * (yBounds[1] - yBounds[0]) + yBounds[0];
    var x = Math.sqrt(1 + y ** 2);
    var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
    ctx.lineTo(nextCoords[0], nextCoords[1]);
  }
  ctx.stroke();

  // Left side of hyperbola
  var coords = xyToCoords(-Math.sqrt(1 + yBounds[0] ** 2), yBounds[0], xBounds, yBounds, width, height);
  ctx.beginPath();
  ctx.moveTo(coords[0], coords[1])
  for (var pixel = 1; pixel <= height; pixel++) {
    var y = (pixel / height) * (yBounds[1] - yBounds[0]) + yBounds[0];
    var x = -Math.sqrt(1 + y ** 2);
    var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
    ctx.lineTo(nextCoords[0], nextCoords[1]);
  }
  ctx.stroke();
}

function shadeUnitCircle(config, input, color='pink') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  
  ctx.beginPath();
  var coords = xyToCoords(1, 0, xBounds, yBounds, width, height);
  ctx.moveTo(coords[0], coords[1]);
  var xEquals1Coord = coords[0];
  var cosCoord = xyToCoords(Math.cos(input), 0, xBounds, yBounds, width, height)[0];
  var xEqualsNeg1Coord = xyToCoords(-1, 0, xBounds, yBounds, width, height)[0];
  // Trace circle
  if (input > Math.PI) {
    for (var pixel = xEquals1Coord; pixel >= xEqualsNeg1Coord; pixel--) {
      var x = (pixel / width) * (xBounds[1] - xBounds[0]) + xBounds[0];
      var y = Math.sqrt(1 - x ** 2);
      var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
      ctx.lineTo(nextCoords[0], nextCoords[1]);
    }
    for (var pixel = xEqualsNeg1Coord; pixel <= cosCoord; pixel++) {
      var x = (pixel / width) * (xBounds[1] - xBounds[0]) + xBounds[0];
      var y = -Math.sqrt(1 - x ** 2);
      var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
      ctx.lineTo(nextCoords[0], nextCoords[1]);
    }
  }
  else {
    for (var pixel = xEquals1Coord; pixel >= cosCoord; pixel--) {
      var x = (pixel / width) * (xBounds[1] - xBounds[0]) + xBounds[0];
      var y = Math.sqrt(1 - x ** 2);
      var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
      ctx.lineTo(nextCoords[0], nextCoords[1]);
    }
  }
  coords = xyToCoords(Math.cos(input), Math.sin(input), xBounds, yBounds, width, height);
  ctx.lineTo(coords[0], coords[1]);
  // Move to origin
  coords = xyToCoords(0, 0, xBounds, yBounds, width, height);
  ctx.lineTo(coords[0], coords[1]);
  // Move to (1, 0)
  coords = xyToCoords(1, 0, xBounds, yBounds, width, height);
  ctx.lineTo(coords[0], coords[1]);
  ctx.fill();
}

function shadeUnitHyperbola(config, input, color='pink') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];

  updateCanvasSize(canvas);

  var width = canvas.width;
  var height = canvas.height;

  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  
  ctx.beginPath();
  var coords = xyToCoords(1, 0, xBounds, yBounds, width, height);
  ctx.moveTo(coords[0], coords[1]);
  var yAxisCoord = coords[1];
  // Move from (1, 0) to origin
  coords = xyToCoords(0, 0, xBounds, yBounds, width, height);
  ctx.lineTo(coords[0], coords[1]);
  // Move to (cosh(x), sinh(x))
  coords = xyToCoords(Math.cosh(input), Math.sinh(input), xBounds, yBounds, width, height);
  ctx.lineTo(coords[0], coords[1]);
  // Trace hyperbola
  if (input > 0) {
    for (var pixel = coords[1]; pixel <= yAxisCoord; pixel++) {
      var y = (1 - pixel / height) * (yBounds[1] - yBounds[0]) + yBounds[0];
      var x = Math.sqrt(1 + y ** 2);
      var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
      ctx.lineTo(nextCoords[0], nextCoords[1]);
    }
  }
  else {
    for (var pixel = coords[1]; pixel >= yAxisCoord; pixel--) {
      var y = (1 - pixel / height) * (yBounds[1] - yBounds[0]) + yBounds[0];
      var x = Math.sqrt(1 + y ** 2);
      var nextCoords = xyToCoords(x, y, xBounds, yBounds, width, height);
      ctx.lineTo(nextCoords[0], nextCoords[1]);
    }
  }
  ctx.fill();
}

function plotPoint(config, x, y, color='blue', empty=false) {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];
  ctx.fillStyle = color;
  var coords = xyToCoords(x, y, xBounds, yBounds, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
  if (empty) {
    ctx.fillStyle = darkModeEnabled ? '#222222' : '#f3f3f3';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
    ctx.stroke();
  }
  else {
    ctx.fill();
  }
}

function plotTangentLine(config, func, derivative, pointX, color='green') {
  var slope = derivative(pointX);
  var pointY = func(pointX);
  if (Math.abs(slope) === Infinity && isFinite(pointY)) {
    // Vertical tangent line
    plotVerticalLine(config, pointX, color);
  }
  canvasGraph(config, x => slope * (x - pointX) + pointY, color, false);
}

function plotSecantLine(config, func, point1X, point2X, color='purple') {
  var slope = (func(point2X) - func(point1X)) / (point2X - point1X);
  canvasGraph(config, x => slope * (x - point1X) + func(point1X), color, false);
}

function drawRectangle(config, x1, x2, y1, y2, strokeColor='blue', fillColor='lightblue') {
  // x1 = left edge
  // x2 = right edge
  // y1 = bottom edge
  // y2 = top edge
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];
  var width = canvas.width;
  var height = canvas.height;

  var leftBottomCoords = xyToCoords(x1, y1, xBounds, yBounds, width, height);
  var leftCoord = leftBottomCoords[0];
  var bottomCoord = leftBottomCoords[1];
  var rightTopCoords = xyToCoords(x2, y2, xBounds, yBounds, width, height);
  var rightCoord = rightTopCoords[0];
  var topCoord = rightTopCoords[1];

  ctx.lineWidth = 2;
  ctx.strokeStyle = strokeColor;
  ctx.strokeRect(leftCoord, topCoord, rightCoord - leftCoord, bottomCoord - topCoord);
  ctx.fillStyle = fillColor;
  ctx.fillRect(leftCoord, topCoord, rightCoord - leftCoord, bottomCoord - topCoord);
}

function drawTrapezoid(config, x1, x2, leftHeight, rightHeight, strokeColor='blue', fillColor='lightblue') {
  var canvas = config['canvas'];
  var ctx = config['ctx'];
  var xBounds = config['xBounds'];
  var yBounds = config['yBounds'];
  var width = canvas.width;
  var height = canvas.height;

  var leftBottomCoords = xyToCoords(x1, 0, xBounds, yBounds, width, height);
  var leftCoord = leftBottomCoords[0];
  var bottomCoord = leftBottomCoords[1];
  var leftHeightCoord = xyToCoords(x1, leftHeight, xBounds, yBounds, width, height)[1];
  var rightHeightCoords = xyToCoords(x2, rightHeight, xBounds, yBounds, width, height);
  var rightCoord = rightHeightCoords[0];
  var rightHeightCoord = rightHeightCoords[1];


  ctx.lineWidth = 2;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(leftCoord, bottomCoord);
  ctx.lineTo(leftCoord, leftHeightCoord);
  ctx.lineTo(rightCoord, rightHeightCoord);
  ctx.lineTo(rightCoord, bottomCoord);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

// Slider functions
function increaseSliderMax(sliderID, buttonID, oldMax, newMax, geometric=true) {
  get(buttonID).classList.add('hidden');
  // will only work if slider minimum is 1
  if (geometric) {
    get(sliderID).max = Math.log(newMax) / Math.log(oldMax);
  }
  else {
    get(sliderID).max = (newMax - 1) / (oldMax - 1);
  }
}

function setSliderValue(id, value) {
  var settings = sliderSettings[id];
  var sliderRange = settings['sliderRange'];
  var sliderMin = sliderRange[0];
  var sliderMax = sliderRange[1];
  if (settings['geometric']) {
    var sliderPos = (Math.log(value) - Math.log(sliderMin)) / (Math.log(sliderMax) - Math.log(sliderMin));
  }
  else {
    var sliderPos = (value - sliderMin) / (sliderMax - sliderMin);
  }
  get(id + 'Slider').value = sliderPos;
  updateSliderValues(id);
}

function getSliderValue(id) {
  var min = sliderSettings[id]['sliderRange'][0];
  var max = sliderSettings[id]['sliderRange'][1];
  return parseFloat(get(id + 'Slider').value) * (max - min) + min;
}

function updateSliderValues(id, inputX=false, forceUpdate=false) {
  var sliderID = id + 'Slider';
  var outputID = id + 'Val';
  var slider = get(sliderID);
  if (slider === null) {
    return;
  }

  var value = parseFloat(slider.value);

  // Save slider value to prevSliderValues
  var prevSliderValue = prevSliderValues[id];
  // If the slider value hasn't changed, don't bother updating everything else
  if (value === prevSliderValue && !forceUpdate && !inputX) {
    return;
  }

  prevSliderValues[id] = value;

  // Default values
  var geometric = false;
  var inputPlaces = 3;
  var outputPlaces = 3;
  var instantUpdate = true;
  var endingTerms = 1;
  var forceUpdate = null;
  var maxSigFigs = null;

  var partialSum = id in sequenceSettings;
  // Partial sum of infinite series: set func to partial sum function
  if (partialSum) {
    var settings = sequenceSettings[id];
    var ruleFunc = settings['rule'];
    if ('partialSum' in settings) {
      var func = settings['partialSum'];
    }
    else {
      var func = slowPartialSum(ruleFunc);
    }
    if ('termDisplayRule' in settings) {
      var termDisplayRule = settings['termDisplayRule'];
    }
    else {
      var termDisplayRule = null;
    }
    if ('geometric' in settings) {
      geometric = settings['geometric'];
    }
    var displayAsFraction = false;
    if ('displayAsFraction' in settings) {
      displayAsFraction = settings['displayAsFraction'];
    }
    inputPlaces = 0;
    outputPlaces = settings['places'];
    if ('endingTerms' in settings) {
      endingTerms = settings['endingTerms'];
    }
    if ('maxSigFigs' in settings) {
      maxSigFigs = settings['maxSigFigs'];
    }
  }
  else if (id in sliderSettings) {
    var settings = sliderSettings[id];
    var func = settings['func'];
    if ('geometric' in settings) {
      geometric = settings['geometric'];
    }
    if ('inputPlaces' in settings) {
      inputPlaces = settings['inputPlaces'];
    }
    if ('outputPlaces' in settings) {
      outputPlaces = settings['outputPlaces'];
    }
    if ('instantUpdate' in settings) {
      instantUpdate = settings['instantUpdate'];
    }
    if ('forceUpdate' in settings) {
      forceUpdate = settings['forceUpdate'];
    }
  }

  var sliderRange = settings['sliderRange'];
  var sliderMin = sliderRange[0];
  var sliderMax = sliderRange[1];

  if (inputX) {
    var x = round(parseFloat(get(id + 'Input').value), inputPlaces);
    if (!isFinite(x)) {
      return;
    }
  }
  else {
    // Calculate value of x based on slider position
    if (geometric) {
      var x = round(Math.exp((Math.log(sliderMax) - Math.log(sliderMin)) * value) * sliderMin, inputPlaces);
    }
    else {
      var x = round((sliderMax - sliderMin) * value + sliderMin, inputPlaces);
    }
  }
  
  // Display partial sum if necessary
  if (partialSum) {
    displayPartialSum(id, settings['rule'], func, x, outputPlaces, displayAsFraction, endingTerms, termDisplayRule, maxSigFigs);
    if ('ruleB' in settings) {
      displayPartialSum(id + 'B', settings['ruleB'], settings['partialSumB'], x, outputPlaces, displayAsFraction, endingTerms, termDisplayRule);
    }
  }

  // Update x-value
  if (elementsExist(outputID + '1') && instantUpdate) {
    get(outputID + '1').innerText = formatNum(x, inputPlaces);
  }

  // Update f(x) value
  var f_x = null;
  if (func !== undefined) {
    f_x = func(x);
  }
  if (f_x !== null && f_x !== undefined) {
    f_x = round(f_x, outputPlaces);
    if (elementsExist(outputID + '2') && instantUpdate) {
      get(outputID + '2').innerText = formatNum(f_x, outputPlaces, maxSigFigs);
    }
  }

  if (forceUpdate !== null) {
    updateSliderValues(forceUpdate, false, true);
  }

  // Initialize graph and derivative functions
  if (id in graphSettings) {
    var config = graphSettings[id];
    var graphFunc = config['func'];
    var derivative = config['derivative'];
  }
  
  // Special handling for sliders that display additional values
  if (id === '2dVectorLineInteractive') {
    var graphFunc2 = x0 => x0 < x ? graphFunc(x0) : NaN;
    canvasGraph(config, graphFunc2);
    const arrowheadAngle = Math.PI / 6;
    const arrowheadLength = 0.7;
    const vector = [1, 3];
    plotVector(config, x, func(x), x + vector[0], func(x) + vector[1], 'green', arrowheadLength, arrowheadAngle);
    plotPoint(config, x, func(x));
  }
  else if (id === 'dotProduct') {
    var config = graphSettings['dotProduct'];
    initializeGraph(config);
    var angle1 = (sliderMax - sliderMin) * get('dotProductSlider').value + sliderMin;
    var angle2 = (sliderMax - sliderMin) * get('dotProductSlider2').value + sliderMin;
    var theta = Math.abs(angle2 - angle1);
    if (theta > Math.PI) {
      theta = 2 * Math.PI - theta;
    }
    plotVector(config, 0, 0, Math.cos(angle1), Math.sin(angle1));
    plotVector(config, 0, 0, Math.cos(angle2), Math.sin(angle2), 'blue');
    get('dotProductTheta').innerText = `${formatNum(theta, inputPlaces)} radians`;
    get('dotProductThetaDegrees').innerText = `${formatNum(theta * 180 / Math.PI, 0)} degrees`;
    get('dotProductVal').innerText = formatNum(Math.cos(theta), outputPlaces);
  }
  else if (id === 'partialDiffX') {
    get(id + 'Derivative').innerText = formatNum(4 * x, outputPlaces);
  }
  else if (id === 'partialDiffY') {
    get(id + 'Derivative').innerText = formatNum(4, outputPlaces);
  }
  else if (['multivarFunc2X', 'multivarFunc2Y'].includes(id)) {
    var xVal = getSliderValue('multivarFunc2X');
    var yVal = getSliderValue('multivarFunc2Y');
    get('multivarFunc2XVal').innerText = formatNum(xVal, outputPlaces);
    get('multivarFunc2YVal').innerText = formatNum(yVal, outputPlaces);
    get('multivarFunc2Val').innerText = formatNum(xVal ** 2 + yVal ** 2, outputPlaces);
  }
  else if (['multivarFunc3X', 'multivarFunc3Y', 'multivarFunc3Z'].includes(id)) {
    var xVal = getSliderValue('multivarFunc3X');
    var yVal = getSliderValue('multivarFunc3Y');
    var zVal = getSliderValue('multivarFunc3Z');
    get('multivarFunc3XVal').innerText = formatNum(xVal, outputPlaces);
    get('multivarFunc3YVal').innerText = formatNum(yVal, outputPlaces);
    get('multivarFunc3ZVal').innerText = formatNum(zVal, outputPlaces);
    get('multivarFunc3Val').innerText = formatNum(xVal ** 2 + yVal ** 2 + zVal ** 2, outputPlaces);
  }
  else if (['linearApproxX', 'linearApproxY'].includes(id)) {
    var xVal = getSliderValue('linearApproxX');
    var yVal = getSliderValue('linearApproxY');
    get('linearApproxXVal').innerText = formatNum(xVal, outputPlaces);
    get('linearApproxYVal').innerText = formatNum(yVal, outputPlaces);
    get('linearApproxFuncVal').innerText = formatNum(Math.sqrt(xVal) + Math.log(yVal), outputPlaces);
    get('linearApproxVal').innerText = formatNum(1 + 0.5 * (xVal - 1) + (yVal - 1), outputPlaces);
  }
}

function updateSliders(forceUpdate=false) {
  // Regular sliders
  for (var sliderName in sliderSettings) {
    if (sliderName === 'dotProduct') {
      var forceUpdateForThisSlider = true;
    }
    else {
      var forceUpdateForThisSlider = forceUpdate;
    }
    updateSliderValues(sliderName, false, forceUpdateForThisSlider);
  }
  // Partial sum sliders
  for (var sliderName of partialSumSliders) {
    updateSliderValues(sliderName, false, forceUpdate);
  }
}

function randomVectors() {
  get('dotProductSlider').value = Math.random();
  get('dotProductSlider2').value = Math.random();
  updateSliders();
}

function orthogonalVectors() {
  var value = Math.random();
  get('dotProductSlider').value = value;
  if (Math.random() > 0.5) {
    get('dotProductSlider2').value = (value + 0.25) % 1;
  }
  else {
    get('dotProductSlider2').value = ((value - 0.25) % 1 + 1) % 1;
  }
  updateSliders();
}

// Keep track of the state of each sequence (what terms are currently being displayed)
var sequenceStates = {}
for (var element in sequenceSettings) {
  sequenceStates[element] = 1;
  displaySequence(element);
}

// Get all partial sum sliders
var partialSumSliders = [];
for (var seqName in sequenceSettings) {
  if ('sliderRange' in sequenceSettings[seqName]) {
    partialSumSliders.push(seqName);
  }
}

// Keep track of previous slider values so we can see which slider changes
var prevSliderValues = {}
// Regular sliders
for (var sliderName in sliderSettings) {
  prevSliderValues[sliderName] = null;
}
// Partial sum sliders
for (var sliderName of partialSumSliders) {
  prevSliderValues[sliderName] = null;
}
// Length of each circle animation loop in seconds
const cycleLength = 3;
var canvasAnimationConfig = graphSettings['2dVectorLine'];
const pageOpenedTime = Date.now();

var elementsOnScreen = {};
var lastOnScreenCheck = {};
function onScreen(element) {
  if (!(element.id in lastOnScreenCheck)) {
    lastOnScreenCheck[element.id] = 0;
  }
  if ((Date.now() - lastOnScreenCheck[element.id]) > 100 || !(element.id in elementsOnScreen)) {
    var rect = element.getBoundingClientRect(); 
    var elementOnScreen = rect.width > 0 && rect.top >= -element.height && rect.bottom <= window.innerHeight + element.height;
    elementsOnScreen[element.id] = elementOnScreen;
    lastOnScreenCheck[element.id] = Date.now();
    return elementOnScreen;
  }
  return elementsOnScreen[element.id];
}

function canvasAnimation(canvas, ctx) {
  var canvasOnScreen = onScreen(canvas);
  if (canvas.id !== '2dVectorLine' && !canvasOnScreen) {
    return;
  }
  if (canvasOnScreen || (canvas.id === '2dVectorLine' && onScreen(get('2dVectorLineCanvas')))) {
    var secondsSincePageOpened = (Date.now() - pageOpenedTime) / 1000;
    // Seconds into the cycle
    var cycleSeconds = secondsSincePageOpened % cycleLength;
    if (canvas.id === '2dVectorLineCanvas') {
      var func = canvasAnimationConfig['func'];
      var pointX = cycleSeconds;
      var graphFunc = x => x < pointX ? func(x) : NaN;
      canvasGraph(canvasAnimationConfig, graphFunc);
      const arrowheadAngle = Math.PI / 6;
      const arrowheadLength = 0.7;
      const vector = [1, 3];
      plotVector(canvasAnimationConfig, pointX, func(pointX), pointX + vector[0], func(pointX) + vector[1], 'green', arrowheadLength, arrowheadAngle);  
      plotPoint(canvasAnimationConfig, pointX, func(pointX));
    }
  }
}

if (elementsExist(['2dVectorLineCanvas'])) {
  var animationCanvas = get('2dVectorLineCanvas');
  var animationCtx = animationCanvas.getContext('2d');
  setInterval(() => canvasAnimation(animationCanvas, animationCtx), 1000 / 60);
}

// Search bar functionality
var sectionTitles = {};

// Additional keywords for sections that the search feature looks at
// For example, searching for "Trig Sub" makes the Trigonometric Substitution section appear as a result
const searchKeywords = {
  'ivt': ['IVT'],
  'diffInvTrig': ['Inverse Trigonometric Functions'],
  'diffSecond': ['2nd Derivatives', 'Third Derivatives', '3rd Derivatives'],
  'mvt': ['MVT'],
  'evt': ['Extremum', 'EVT'],
  'diffStrat': ['Derivative Strategies', 'Derivative Strategy', 'Differentiation Strategy'],
  'relExtrema': ['Relative Extremums', 'Relative Minima', 'Relative Minimums', 'Relative Maxima', 'Relative Maximums', 'Local Extrema', 'Local Extremums', 'Local Minima', 'Local Minimums', 'Local Maxima', 'Local Maximums'],
  'absExtrema': ['Absolute Extremums', 'Absolute Minima', 'Absolute Minimums', 'Absolute Maxima', 'Absolute Maximums', 'Global Extrema', 'Global Extremums', 'Global Minima', 'Global Minimums', 'Global Maxima', 'Global Maximums'],
  'concavity': ['Concave Up', 'Concave Down'],
  'connectingDiff': ['Derivative Graphs'],
  'diffHopital': ["L'Hopital's Rule", "L'Hospital's Rule"],
  'indefSubst': ['Integration by Substitution'],
  'defSubst': ['Integration by Substitution'],
  'sinCosInt': ['Trig Integrals'],
  'otherTrigInt': ['Trig Integrals'],
  'trigSub': ['Trig Substitution'],
  'intAvg': ['MVT'],
  'nthTermTest': ['nth-Term Test'],
  'taylorProblems': ['Maclaurin Polynomials'],
  'taylorSeries': ['Maclaurin Series']
};

// Determine title of every section
for (var element of document.getElementsByClassName('section-header')) {
  var sectionTitle = element.innerText.trim();
  sectionTitle = sectionTitle.replace(/ *(Show|Hide)$/, ''); // Remove "Show" or "Hide" from the end
  sectionTitle = sectionTitle.replace(/\\\(/g, '').replace(/\\\)/g, '').replace(/\\/g, ''); // Remove mathjax delimiters
  sectionTitles[element.id.replace(/Header$/, '')] = sectionTitle;
}

function searchForSection(query) {
  query = query.toLowerCase().replace(/’/g, "'").replace(/-/g, ' ');
  var searchResults = [];
  for (var id in sectionTitles) {
    var titlesToCheck = [sectionTitles[id]];
    // Check for keywords
    if (id in searchKeywords) {
      titlesToCheck = titlesToCheck.concat(searchKeywords[id]);
    }

    for (var sectionTitle of titlesToCheck) {
      // Typing straight apostrophes should still work
      sectionTitle = sectionTitle.toLowerCase().replace(/’/g, "'").replace(/-/g, ' ');
      if (sectionTitle.includes(query)) {
        searchResults.push(id);
        break;
      }
    }
  }
  return searchResults;
}

const maxSearchResults = 5;

function searchJumpGenerator(id) {
  // Generates a function that jumps to id and closes search window
  // Used for the search result links
  return () => {
    jumpTo(id);
    hideElement('searchPopup');
  };
}

function searchInput(showAll=false) {
  var searchQuery = get('searchInput').value;

  if (searchQuery === '') {
    return;
  }
  else if (searchQuery.toLowerCase() === 'calculus gaming') {
    get('searchMessage').innerText = 'calculus gaming indeed!';
    return;
  }

  var searchResults = searchForSection(searchQuery);
  get('searchResults').innerHTML = '';
  if (searchResults.length === 0) {
    get('searchMessage').innerText = 'No sections found.';
    return;
  }

  get('searchMessage').innerText = '';

  var resultsToShow = showAll ? searchResults.length : maxSearchResults;
  for (var id of searchResults.slice(0, resultsToShow)) {
    var headerID = id + 'Header';
    var li = document.createElement('li');
    var link = document.createElement('a');
    // Find which unit the section belongs to
    for (var unitName of unitElementIDs) {
      if (unitSections[unitName].includes(id)) {
        var unitNum = unitElementIDs.indexOf(unitName) + 1;
      }
    }
    link.innerHTML = `<strong>Unit ${unitNum}</strong>: ${sectionTitles[id]}`;
    link.href = `#${headerID}`;
    link.onclick = searchJumpGenerator(id);
    li.appendChild(link);
    get('searchResults').appendChild(li);
  }
  if (searchResults.length > maxSearchResults && !showAll) {
    var li = document.createElement('li');
    var button = document.createElement('button');
    button.innerText = `Show all results (${searchResults.length - maxSearchResults} more)`;
    button.onclick = () => searchInput(true);
    li.appendChild(button);
    get('searchResults').appendChild(li);
  }
}

function searchButton() {
  showHide('searchPopup');
  hideElement('keyboardShortcutPopup');
  toggleSidebar();
  get('searchInput').focus();
}

function keyboardShortcutButton() {
  showHide('keyboardShortcutPopup');
  hideElement('searchPopup');
  toggleSidebar();
}

// Canvas functions
function drawCircle(canvas, ctx, x, y, radius, fill=false, color='black') {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}


// "Page flipping" interactivity
const lastPages = {
  
};

var currentPages = {
  
};

function pageFlipToggle(lesson, mode) {
  var currentPage = currentPages[lesson];
  var lastPage = lastPages[lesson];
  if (mode === 'next') {
    if (currentPage >= lastPage) {
      return;
    }
    currentPages[lesson]++;
    currentPage++;
  }
  else {
    if (currentPage <= 1) {
      return;
    }
    currentPages[lesson]--;
    currentPage--;
  }

  for (var page = 1; page <= lastPage; page++) {
    if (page !== currentPage) { 
      hideElement(`${lesson}${page}`);
    }
  }
  showElement(`${lesson}${currentPage}`);
}

// Keyboard shortcut functions
const shiftKeys = '!@#$%^&*()';
const topRowKeys = 'QWERTYUIOP';
function keyToUnit(key) {
  if (shiftKeys.includes(key)) {
    var unit = shiftKeys.indexOf(key) + 1;
  }
  else if (topRowKeys.includes(key)) {
    var unit = topRowKeys.indexOf(key) + 1;
  }
  else if (isFinite(key)) {
    var unit = parseInt(key);
  }
  else {
    return null;
  }

  if (unit === 0) {
    unit = 10;
  }
  if (unit >= unitElementIDs.length) {
    return null;
  }
  return unitElementIDs[unit - 1].replace('Unit', '');
}

function keyboardShortcut(event) {
  if (event.key === 'Escape') {
    for (var id of ['search', 'intro', 'keyboardShortcut']) {
      if (!isHidden(id + 'Popup')) {  
        showHide(id + 'Popup');
      }
    }
  }

  if (!isHidden('searchPopup') && event.key === 'Enter') {
    var searchInput = get('searchInput').value;
    var topHit = searchForSection(searchInput)[0];
    if (topHit !== undefined && searchInput !== '') {
      jumpTo(topHit.replace(/Header$/, ''));
      hideElement('searchPopup');
    }
  }
  // If user is typing in an input element, disable keyboard shortcuts
  if (['number', 'text'].includes(document.activeElement.type)) {
    return;
  }
  var key = event.key;
  if (key === '`') {
    get('websiteHeader').scrollIntoView();
    return;
  }
  else if (key === '\\') {
    showElement('what');
    showElement('progress');
    get('progressButton').innerText = customTextButtons['progress']['hideText'];
    get('progressButton').scrollIntoView();
  }
  else if (key === ']') {
    showElement('updateHistory');
    get('updateHistoryHeader').scrollIntoView();
  }
  else if (key === 's') {
    event.preventDefault();
    searchButton();
  }
  else if (key === 'S') {
    showElement('settings');
    get('settingsHeader').scrollIntoView();
  }
  else if (key === 'K') {
    keyboardShortcutButton();
  }
  else if (key === 'D') {
    toggleDarkMode();
  }
  else if ('_+{}|'.includes(key)) {
    for (var unit of unitElementIDs) {
      var rawUnitName = unit.replace('Unit', '');
      if (key === '_') {
        toggleAllSections(rawUnitName, 'hide');
      }
      else if (key === '+') {
        hideElement(rawUnitName);
      }
      else if (key === '{') {
        toggleAllSections(rawUnitName, 'show');
      }
      else if (key === '}') {
        showUnit(rawUnitName);
      }
      else if (key === '|') {
        for (var element of ['toc', 'updateHistory', 'what', 'links', 'whyCalc']) {
          hideElement(element);
        }
      }
    }
    updateFooter();
    return;
  }

  var unitName = keyToUnit(key);
  if (unitName === null) {
    return;
  }

  // Number keys
  jumpTo(unitName);
  // Shift + Number keys
  if (shiftKeys.includes(key)) {
    toggleAllSections(unitName, 'hide');
  }
  // Top row keys
  if (topRowKeys.includes(key)) {
    toggleAllSections(unitName, 'show');
  }

  updateFooter();
}

var elementsHiddenByDefault = [];
for (var element of document.getElementsByClassName('hidden-by-default')) {
  elementsHiddenByDefault.push(element.id);
}

// Show All Features button on What Is This Website section
function showAllFeatures() {
  hideElement('importantFeatures');
  showElement('allFeatures');
}

// Custom text button text

// Elements that are hidden because they are formal definitions
// Stored in the format {[id]: [concept name]}
var formalElements = {
  
};

for (var element in formalElements) {
  customTextButtons[element] = {
    'showText': `Give me a formal definition of ${formalElements[element]}.`,
    'hideText': 'Hide Formal Definition'
  };
}

// Automatically figure out custom button text based on ids
for (var element of elementsHiddenByDefault) {
  if (element in customTextButtons) {
    continue;
  }
  // Hint elements
  if (element.endsWith('Hint')) {
    customTextButtons[element] = {
      'showText': 'Give me a hint!',
      'hideText': 'Hide Hint'
    };
  }
  // Reveal elements: elements that are hidden under a "Show me the answer!" button
  else if (element.endsWith('Reveal')) {
    customTextButtons[element] = {
      'showText': 'Show me the answer!',
      'hideText': 'Hide Answer'
    };
  }
  // Infinite sum visuals
  else if (element.endsWith('SumVisual')) {
    customTextButtons[element] = {
      'showText': 'Visualize this sum for me!',
      'hideText': 'Hide Visualization'
    };
  }
  // Full work elements
  else if (element.endsWith('Work')) {
    customTextButtons[element] = {
      'showText': 'Show Full Work',
      'hideText': 'Hide Full Work'
    };
  }
}

function updateFooter() {
  if (Date.now() < lastUpdateFooter + 100 || !elementsExist('footerLink')) {
    // Only want this to run every 100ms
    return;
  }
  lastUpdateFooter = Date.now();
  var newUnit = getCurrentUnit();
  if (newUnit !== currentUnit && newUnit !== undefined) {
    currentUnit = newUnit;
    get('footerLink').href = '#' + newUnit;
    get('footerLink').innerText = `Top of Unit ${unitElementIDs.indexOf(newUnit) + 1}`;
  }
}

function toggleSidebar() {
  var sidebarClassList = get('sidebar').classList;
  var menuIconClassList = get('menuIcon').classList;
  if (sidebarClassList.contains('sidebar-hidden')) {
    // reveal sidebar
    sidebarClassList.remove('sidebar-hidden');
    menuIconClassList.add('menu-icon-shifted');
    menuIconClassList.remove('menu-icon-normal');
    hideElement('hamburgerIcon', null, null, false);
    showElement('xIcon', null, null, false);
  }
  else {
    // hide sidebar
    sidebarClassList.add('sidebar-hidden');
    menuIconClassList.remove('menu-icon-shifted');
    menuIconClassList.add('menu-icon-normal');
    hideElement('xIcon', null, null, false);
    showElement('hamburgerIcon', null, null, false);
  }
}

// Elements manually hidden/shown by the user
// Saved to localStorage so that it remains hidden/shown after reloading/revisiting the page
var hiddenElements = [];
var shownElements = [];

if (localStorageGet('hiddenElements') !== null) {
  try {
    hiddenElements = JSON.parse(localStorageGet('hiddenElements'));
  }
  // If data is corrupted, delete it
  catch (e) {
    localStorage.removeItem(localStorageName + 'hiddenElements');
  }
}

if (localStorageGet('shownElements') !== null) {
  try {
    shownElements = JSON.parse(localStorageGet('shownElements'));
  }
  catch (e) {
    localStorage.removeItem(localStorageName + 'shownElements');
  }
}

// Elements in hiddenElements that don't actually exist for some reason; maybe I changed the name of an element or I removed a section
var badElements = [];

// Don't hide elements that are already hidden by default, and don't show elements that are shown by default
hiddenElements = hiddenElements.filter(element => !elementsHiddenByDefault.includes(element));
shownElements = shownElements.filter(element => elementsHiddenByDefault.includes(element));

function resetStorage() {
  localStorage.removeItem(localStorageName + 'hiddenElements');
  localStorage.removeItem(localStorageName + 'shownElements');
  localStorage.removeItem(localStorageName + 'lastUpdateDate');
  localStorage.removeItem(localStorageName + 'darkMode');
  localStorage.removeItem(localStorageName + 'graphsInverted');
}

var darkModeEnabled = false;
const darkModeColors = ['red', 'blue', 'green', 'purple', 'teal', 'gray', 'black', 'bc-only-color', 'bonus-color', 'interactive-color', 'lesson-complete', 'lesson-incomplete', 'external-link', 'problem', 'sidebar-button', 'footer', 'footer-link', 'warning'];
const mathjaxColors = ['red', 'blue', 'green', 'purple', 'teal'];

function toggleDarkModeTextColors(mathjaxUpdate=false) {
  if (mathjaxUpdate) {
    var colors = mathjaxColors;
  }
  else {
    var colors = darkModeColors;
  }

  for (var color of colors) {
    for (var element of getClassElements(color)) {
      var colorDarkMode = color + '-dark-mode';
      if (darkModeEnabled && !mathjaxUpdate) {
        element.classList.remove(colorDarkMode);
      }
      else if (!element.classList.contains(colorDarkMode)) {
        element.classList.add(colorDarkMode);
      }
    }
  }
}

function toggleDarkMode() {
  if (darkModeEnabled) {
    get('body').classList.remove('body-dark-mode');
    get('sidebar').classList.remove('sidebar-dark-mode');
    get('keyboardIcon').src = 'images/keyboard.svg';
    get('searchIcon').src = 'images/search.svg';
    get('logo').src = 'images/logo_transparent.png';
    get('sidebarLogo').src = 'images/logo_transparent.png';
    for (var element of getClassElements(['sn', 'sidenote'])) {
      element.classList.remove('sidenote-dark-mode');
    }
    for (var element of document.getElementsByTagName('table')) {
      element.classList.remove('table-dark-mode')
    }
    for (var element of document.getElementsByTagName('th')) {
      element.classList.remove('table-dark-mode')
    }
    for (var element of document.getElementsByTagName('td')) {
      element.classList.remove('table-dark-mode')
    }
    for (var element of document.getElementsByTagName('button')) {
      element.classList.remove('button-dark-mode')
    }
    for (var element of document.getElementsByTagName('a')) {
      if (!element.classList.contains('external-link')) {
        element.classList.remove('internal-link-dark-mode')
      }
    }
  }
  else {
    get('body').classList.add('body-dark-mode');
    get('sidebar').classList.add('sidebar-dark-mode');
    get('keyboardIcon').src = 'images/keyboard_dark_mode.svg';
    get('searchIcon').src = 'images/search_dark_mode.svg';
    get('logo').src = 'images/logo_dark_transparent.png';
    get('sidebarLogo').src = 'images/logo_dark_transparent.png';
    for (var element of getClassElements(['sn', 'sidenote'])) {
      element.classList.add('sidenote-dark-mode');
    }
    for (var element of document.getElementsByTagName('table')) {
      element.classList.add('table-dark-mode')
    }
    for (var element of document.getElementsByTagName('th')) {
      element.classList.add('table-dark-mode')
    }
    for (var element of document.getElementsByTagName('td')) {
      element.classList.add('table-dark-mode')
    }
    for (var element of document.getElementsByTagName('button')) {
      element.classList.add('button-dark-mode')
    }
    for (var element of document.getElementsByTagName('a')) {
      if (!element.classList.contains('external-link')) {
        element.classList.add('internal-link-dark-mode')
      }
    }
  }
  toggleDarkModeTextColors();
  darkModeEnabled = !darkModeEnabled;
  if (darkModeEnabled) {
    get('darkModeCheckbox').checked = true;
  }
  else {
    get('darkModeCheckbox').checked = false;
  }
  localStorageSet('darkMode', darkModeEnabled);
  updateSliders(true);
}

// Force Mathjax colors to update to dark mode when they are loaded
function updateMathjaxColors() {
  if (darkModeEnabled) {
    toggleDarkModeTextColors(true);
  }
}

setInterval(updateMathjaxColors, 250);

var graphsInverted = false;
function invertGraphs() {
  for (var element of getClassElements(['graph', 'small-graph', 'large-graph'])) {
    if (graphsInverted) {
      element.classList.remove('inverted');
    }
    else {
      element.classList.add('inverted');
    }
  }
  graphsInverted = !graphsInverted;
  if (graphsInverted) {
    get('invertColorsCheckbox').checked = true;
  }
  else {
    get('invertColorsCheckbox').checked = false;
  }
  localStorageSet('graphsInverted', graphsInverted);
}

function setLargeNumFormat() {
  largeNumFormat = get('largeNumFormat').value;
  localStorageSet('largeNumFormat', largeNumFormat);
}

function setBackgroundImage(url) {
  get('backgroundImage').style.backgroundImage = `url(${url})`;
}

function setOpacity(opacity) {
  get('backgroundImage').style.filter = `opacity(${opacity})`;
}

function setBackgroundSize(size) {
  get('backgroundImage').style.backgroundSize = `${size}px`;
}

// Display and automatically calculate the progress table
if (elementsExist('progressTable')) {
  var table = get('progressTable');
  var lessonsCompleted = 0;
  var lessonsTotal = 0;

  for (var row = 1; row <= 5; row++) {
    var rowCells = table.rows[row].cells;
    var completed = parseInt(rowCells[1].innerText.split('/')[0]);
    var total = parseInt(rowCells[1].innerText.split('/')[1]);
    lessonsCompleted += completed;
    lessonsTotal += total;
    if (completed === total) {
      rowCells[1].classList.add('green');
    }
  }

  var lessonsPct = round(lessonsCompleted / lessonsTotal * 100);
  get('totalProgress').innerText = `${lessonsCompleted}/${lessonsTotal} (${lessonsPct}%)`;
}

// Display the "X Days Ago" text in update history
if (elementsExist('updateHistory')) {
  // Get the date of the most recent update by getting the header of the last update
  var mostRecentUpdate = get('updateHistory').getElementsByTagName('h3')[0];
  var lastUpdateDateStr = mostRecentUpdate.innerText.split(':')[0];
  var dateParts = lastUpdateDateStr.split('-');
  var lastUpdateDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  var now = new Date();
  // Get local date, ignoring time
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msInDay = 86400 * 1000;
  var daysAgo = Math.round((today - lastUpdateDate) / msInDay);
  if (daysAgo === 0) {
    get('updateDays').innerText = 'Today';
  }
  else if (daysAgo === 1) {
    get('updateDays').innerText = 'Yesterday';
  }
  else {
    get('updateDays').innerText = `${daysAgo} days ago`;
  }

  // If there's been an update since the user last visited the page, make the "Last update: X Days Ago" text green
  var lastUpdateStored = localStorageGet('lastUpdateDate');
  if (lastUpdateStored === null || lastUpdateDateStr !== lastUpdateStored) {
    get('lastUpdate').classList.add('green');
  }
  localStorageSet('lastUpdateDate', lastUpdateDateStr);
}

// To reduce lag and clutter during development, I create new lessons on a "drawing board" html document with an element named "drawingBoard". If the drawingBoard element is detected, it disables all this stuff to prevent the script from erroring
if (!elementsExist('drawingBoard')) {
  var footer = get('footer');
  var lastUpdateFooter = Date.now();
  var currentUnit = null;

  // Get all unit elements
  var unitElements = document.getElementsByClassName('unit');
  var unitElementIDs = [];
  for (var element of unitElements) {
    unitElementIDs.push(element.id);
  }

  // Get all sections within units
  var unitSections = {}
  for (var id of unitElementIDs) {
    unitSections[id] = getSectionsInUnit(id.replace(/Unit$/, ''));
  }

  // Hide elements that are shown by default
  for (var elementID of hiddenElements) {
    if (elementID in customTextButtons) {
      var showText = customTextButtons[elementID]['showText'];
    }
    else {
      var showText = 'Show';
    }
    var element = get(elementID);
    if (element !== null && element.tagName === 'DIV' && !element.classList.contains('unit') && !element.classList.contains('no-permanent-hide')) {
      hideElement(elementID, null, showText, false);
    }
    else {
      // Element stored in hiddenElements isn't something that's supposed to be hidden
      badElements.push(elementID);
    }
  }

  for (var elementID of badElements) {
    removeFromArray(hiddenElements, elementID);
  }

  // Show elements that are hidden by default
  var shownUnits = [];
  // Units to Mathjax typeset immediately on page load
  var unitsToTypeset = [];
  for (var elementID of shownElements) {
    if (elementID in customTextButtons) {
      var hideText = customTextButtons[elementID]['hideText'];
    }
    else {
      var hideText = 'Hide';
    }

    if (!get(elementID).classList.contains('no-permanent-show')) {
      if (unitElementIDs.includes(elementID + 'Unit')) {
        shownUnits.push(elementID);
      }
      else {
        showElement(elementID, null, hideText, false);
      }
    }
  }

  for (var unitElementID of shownUnits) {
    if (shownUnits.indexOf(unitElementID) >= shownUnits.length - 3) {
      // Only show last 3 units that were shown
      showUnit(unitElementID);
      unitsToTypeset.push(unitElementID);
    }
    else {
      hideElement(unitElementID, null, 'Show', false);
    }
  }

  saveHiddenElements();
  saveShownElements();

  document.addEventListener('scroll', updateFooter);
  document.addEventListener('keydown', keyboardShortcut);

  // Settings
  if (localStorageGet('darkMode') === 'true') {
    toggleDarkMode();
  }
  if (localStorageGet('graphsInverted') === 'true') {
    invertGraphs();
  }
  if (localStorageGet('largeNumFormat') !== null) {
    largeNumFormat = localStorageGet('largeNumFormat');
    get('largeNumFormat').value = largeNumFormat;
  }

  for (var element of getClassElements('hidden-until-load')) {
    showElement(element.id);
  }
}

updateSliders();

function loadMathjax() {
  var mathjaxScript = document.createElement('script');
  mathjaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  document.getElementsByTagName('head')[0].appendChild(mathjaxScript);
}

setTimeout(loadMathjax);

get('loading').innerText = 'Loading scripts (2/3)... Some features will not work properly until loading finishes.';
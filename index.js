var moment = require('moment');

// btw this is lifted from here:
// https://github.com/niwinz/moment-tokens/blob/master/moment-tokens.js

function translate_php_format(item) {
  if (item.charAt(0) === "\\") {
    return item.replace("\\", "");
  }
  switch (item) {
    case "D":
      return "ddd";
    case "l":
      return "dddd";
    case "M":
      return "MMM";
    case "F":
      return "MMMM";
    case "j":
      return "D";
    case "m":
      return "MM";
    case "A":
      return "A";
    case "a":
      return "a";
    case "s":
      return "ss";
    case "i":
      return "mm";
    case "H":
      return "HH";
    case "g":
      return "h";
    case "h":
      return "hh";
    case "w":
      return "d";
    case "W":
      return "ww";
    case "y":
      return "YY";
    case "o":
    case "Y":
      return "YYYY";
    case "O":
      return "ZZ";
    case "z":
      return "DDD";
    case "d":
      return "DD";
    case "n":
      return "M";
    case "G":
      return "H";
    case "e":
      return "zz";
    default:
      return item;
  }
}


module.exports = {

  // return raw date obj as "m/d/YYYY - h:m am/pm"
  format_timestamp: function(date){
    var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    var o = months[date.getMonth()] +'/'+ date.getDate() +'/'+ date.getFullYear();
    var hr = date.getHours();
    var ampm = hr < 12 ? "am" : "pm";
    if (hr > 12) {
        hr -= 12;
    } else if (hr === 0) {
       hr = 12;
    }
    var min = date.getMinutes();
    if (min < 10){
      min = "0" + min;
    }
    o += ' - '+ hr +':'+ min + ampm;
    return o;
  },

  // return raw date obj as m/d/YYYY
  format_date_edit: function(date){
    if (date){
      var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      var o = months[date.getMonth()] +'/'+ date.getDate() +'/'+ date.getFullYear();
      return o;
    }
    return false;
  },

  // return given number calculated to given number of decimal places
  to_fixed: function (number, decimals){
    // fixit: cast as number
    return number.toFixed(decimals);
  },

  // transform line breaks to "<br />"
  nl2br: function (text){
    var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br />' + '$2');
    return nl2br;
  },

  // return true(/false) if this item is(/is not) in the array
  in_array: function(haystack, needle, options){
    if (haystack.indexOf(needle) > -1) {
      return options.fn(this);
    }else{
      return options.inverse(this);
    }
  },

  // return true if the first thing equals either the second or third thing
  if_either: function(v1, v2, v3, options){
    if (v1 === v2 || v1 === v3){
      return options.fn(this);
    }
    return options.inverse(this);
  },

  // basic comparison operators
    // will also show if the first thing is contained within the second thing (even it's CSV)
  is: function(left, operator, right, options){
    var operators, result;
    if (arguments.length < 3) {
      throw new Error("'is' needs 2 parameters");
    }
    if (options === undefined) {
      options = right;
      right = operator;
      operator = "===";
    }
    operators = {
      '==': function (l, r) { return l == r; },
      '===': function (l, r) { return l === r; },
      'not': function (l, r) { return l != r; },
      '!=': function (l, r) { return l != r; },
      '!==': function (l, r) { return l !== r; },
      '<': function (l, r) { return l < r; },
      '>': function (l, r) { return l > r; },
      '<=': function (l, r) { return l <= r; },
      '>=': function (l, r) { return l >= r; },
      'typeof': function (l, r) { return typeof l == r; },
      'in': function (l, r) { if ( ! module.exports.is_array(r)) { r = r.split(','); } return r.indexOf(l) > -1; }
    };
    if (!operators[operator]) {
      throw new Error("Unknown operator " + operator);
    }
    result = operators[operator](left, right);
    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  // accepts date object & php date format, returns formatted date string
  date: function(date_object, format, options){
    return moment(date_object).format(format.replace(/\\?./g, translate_php_format));
  }

};

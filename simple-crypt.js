/*
code1.js -- define the encryption and decryption actions for the buttons

*/

//****
//**** CONSTANTS ***
//****

clearAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
cryptAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
cryptOffset = 8;
cryptogram = "BPM LWKBWZ OIDM UM JIL VMEA, GWC'ZM OWQVO BW OMB JMBBMZ."

/*
  PigPen encoding:

  You could use special fonts, but that is beyond the scope of the lesson.
  We will use multiple characters to represent a character. In general the
  cell of the pig pen is drawn using characters: '_' for a line below, 
  '-' for a line above, and '=' for a line above and below the cell.
  '|' represents a verticle line. '<', '>', '\/', '/\'  represent one of the
  angular cells. An additional period character '.' or colon ':' can be added
  to expand the character set. This encoding uses one, two, three, or four
  character symbols to represent a character.
  
  Decoding of this is a problem, as it is hard to distinuish individual symbols,
  wfor example, |-| followed by _|. Is it |-| _| or |- |_|) Fixing the number of
  characters can fix this problem. Padding the symbols to four characters adds
  to the bandwidth. Using a different encoding of the vertical bars such as: a
  bar before is encoded as '(', a bar after is encode as ')' and a bar before and
  after is encoded as '|'. The single character symbols '<' and '>' need to be
  padded with another character which is ignored to make the basic symbol two
  characters long, and the extended symbol containing a period '.' or colon ':'
  three characters long.

  
    |   |   
  A | B | C
  __|___|___
    |   |   
  D | E | F
  __|___|___
    |   |   
  G | H | I  
    |   |   


   \  J /
    \  /  
   K \/  L
     /\
    /  \
   /  M \

    |   |   
  N.| O.| P.
  __|___|___
    |   |   
  Q.| R.| S.
  __|___|___
    |   |   
  T.| U.| V . 
    |   |   


   \  W /
    \. /  
   X \/. Y
   . /\
    /. \
   /  Z \


*/
cryptSymbols = [
  "_)",   /* A */
  "|_",   /* B */
  "(_",   /* C */
  "=)",   /* D */
  "|=",   /* E */
  "(=",   /* F */
  "-)",   /* G */
  "|-",   /* H */
  "(-",   /* I */
  "\\/",  /* J */
  ">/",   /* K */
  "<\\",  /* L */
  "/\\",  /* M */
  "_.)",  /* N */
  "|._",  /* O */
  "(._",  /* P */
  "=.)",  /* Q */
  "|.=",  /* R */
  "(.=",  /* S */
  "-.)",  /* T */
  "|.-",  /* U */
  "(.-",  /* V */
  "\\./", /* W */
  ">.>",  /* X */
  "<.<",  /* Y */
  "/.\\"  /* Z */
];


/*
Morse Code

Developed in the early 1800's for telegraph communications, Morse code allows
communication over a single wire, tone, frequency or light. It is still in use today
because it is simple and is easier to transmit than other techniques.

*/

morseSymbols = [
  ".-",     /* A */
  "-...",   /* B */
  "-.-.",   /* C */
  "-..",    /* D */
  ".",      /* E */
  "..-.",   /* F */
  "--.",    /* G */
  "....",   /* H */
  "..",     /* I */
  ".---",   /* J */
  "-.-",    /* K */
  ".-..",   /* L */
  "--",     /* M */
  "-.",     /* N */
  "---",    /* O */
  ".--.",   /* P */
  "--.-",   /* Q */
  ".-.",    /* R */
  "...",    /* S */
  "-",      /* T */
  "..-",    /* U */
  "...-",   /* V */
  ".--",    /* W */
  "-..-",   /* X */
  "-.--",   /* Y */
  "--.."    /* Z */
];
//console.log (morseSymbols);


//****
//**** FUNCTIONS
//****

function caesarEncryptString (clearString) {
  len = clearString.length;
  cryptString = "";
  for (i=0; i<len; i=i+1) {
    char = clearString.charAt(i).toUpperCase();
    index = clearAlphabet.indexOf( char);
    if (index == -1) { // not found
      cryptString = cryptString + char;
    } else {
      index = (index + cryptOffset) % cryptAlphabet.length;
      cryptString = cryptString + cryptAlphabet.charAt(index);
    }
  }
  return cryptString;
}


function caesarDecryptString (cryptString) {
  //console.log ("CDS:" + cryptString);
  var len = cryptString.length;
  var clearString = "";
  var CAlen = clearAlphabet.length
  for (i=0; i<len; i=i+1) {
    char = cryptString.charAt(i);
    index = cryptAlphabet.indexOf( char);
    if (index == -1) { // not found
      clearString = clearString + char;
    } else {
      index = (index - cryptOffset + CAlen) % CAlen
      clearString = clearString + clearAlphabet.charAt(index);
    }
  }
  return clearString;
}


function pigpenEncryptString (clearString) {
  var len = clearString.length;
  var cryptString = "";
  var char;
  var index;
  for (i=0; i<len; i=i+1) {
    char = clearString.charAt( i).toUpperCase();
    index = clearAlphabet.indexOf( char);
    if (index == -1) { // not found
      cryptString = cryptString + char;
    } else {
      cryptString = cryptString + cryptSymbols[ index];
    }
  }
  return cryptString;
}


function pigpenDecryptString (cryptString) {
  //console.log ("pDS: " + cryptString) 
  var len = cryptString.length;
  var lenSym = cryptSymbols.length;
  var clearString = "";
  var symbol = "";
  for (i=0; i<len; i=i+1) {
    var nextChar = cryptString.charAt(0);
    if ("<>/\\|()-_=".includes( nextChar)) {
      symbol = cryptString.slice(0, 2); // basic symbol has 2 characters
      cryptString = cryptString.slice(2);
      i = i + 1;
      if (symbol.includes(".") || symbol.includes(":")) { // symbol with . has three characters
        symbol = symbol + cryptString.slice(0, 1);
        cryptString = cryptString.slice(1);
        i = i + 1;
      }
      //console.log ("pDS symbol: " + symbol) 
      for (j=0; j<lenSym; j=j+1) {
        if (symbol == cryptSymbols[ j]) {
          index = j;
          j = lenSym +2; // force exit
        }
      }
      if (j == lenSym) {
        // string not found
        clearString = clearString + "_?_";
      } else {
        clearString = clearString + clearAlphabet.charAt(index);
      }
    } else {
      clearString = clearString + nextChar;
      cryptString = cryptString.slice(1);
    }
  }
  return clearString;
}


logCount = 4; // number of logs in fence
/*
Log Fence Encryption

This is basically a systematic way to scramble the letters of a message so that they
can be unscrambed at a destination.

Writing the clear text "The quick brown fox jumped over the lazy dog's tail." to
alernating logs in a matrix fashion yields the following:

T-----i-----o-----x-----e-----r-----l-----o-----a------------
-h---u-c---r-w---o- ---p-d---e- --- -a---d-g---t-i----------
--e-q---k-b---n-f---j-m--- -v---t-e---z- ---'- ---l--------
--- ----- ----- -----u-----o-----h-----y-----s-----.-------

Taking the characters from each line yields:

Tioxerloa
hucrwo pde  adgti
eqkbnfjm vtez ' l
   uohys.

Joining these strings yields:

Tioxerloahucrwo pde  adgtieqkbnfjm vtez ' luohys.

To decode this string just do the steps in reverse.
*/


function logFenceEncryptString (clearString) {
  // encode the strings for each log
  var len = clearString.length;
  var str = []
  for (var i=0; i<logCount; i++) {
    str[ i] = ""
  }
  var dir = +1;
  var row = 0;
  for (var i=0; i<len; i++) {
    str[row] = str[row] + clearString[i];
    row = row + dir;
    if (row >= logCount) {
      row = logCount - 2;
      dir = -1;
    } else if (row < 0) {
      row = 1;
      dir = +1;
    }
    //console.log ("lFES row=" + row + " str: " + str) 
  }

  // concatoneate the log strings
  var cryptString = "";
  for (var i=0; i<logCount; i++) {
    //console.log ("lFES: " + str[i]) 
    cryptString = cryptString + str[i];
  }
  return cryptString;
}


function logFenceDecryptString (cryptString) {
  var len = cryptString.length;

/*
for logCount = 4
0     6       
 1   5 7    11
  2 4   8 10
   3     9

for 2 vees: str.length = 2, 4, 4, 2
one vee is two slants each with logCount-1
*/

  // calculate the length of each row
  var rowLen = [];
  var str = [];
  var numberOfFullSlants = Math.floor(len/(logCount-1)); // truncate fraction
  var numberOfVees = Math.floor(len/(2*(logCount-1))); // truncate fraction
  rowLen[0] = numberOfVees;
  rowLen[logCount-1] = numberOfVees;
  for (var row=1; row<logCount-1; row++) {
    rowLen[row] = numberOfVees * 2;
  }

  partChars = len - (logCount -1) * numberOfVees *2;
  //console.log ("lFDS vees/slants/parts: " + numberOfVees + "/" + numberOfFullSlants + "/" + partChars) 
  row = 0;
  dir = 1;
  for (part=0; part<partChars; part++) {
    rowLen[row] = rowLen[row] + 1;
    row = row + dir;
    if (row>logCount) {
      row = logCount-2;
      dir = -1;
    } else if (row < 0) {
      error; //shouldn't get here
    }
  }
   
  for (var row=0; row<logCount; row++) {
    str[row] = cryptString.slice(0,rowLen[row])
    cryptString = cryptString.slice(rowLen[row])
  }
  //console.log ("lFDS: " + rowLen) 
  for (var i=0; i<logCount; i++) {
    //console.log( "lFDS str: " + i + " '" + str [i] + "'")
  }

  // decrpyt the strings, by pealing off the first letter in order
  var dir = +1;
  var row = 0;
  clearString = "";
  for (var i=0; i<len; i++) {
    clearString = clearString + str[row].charAt(0);
    str[row] = str[row].slice(1)
    row = row + dir;
    if (row >= logCount) {
      row = logCount - 2;
      dir = -1;
    }
    if (row < 0) {
      row = 1;
      dir = +1;
    }
  }
  return clearString;
}


function morseEncryptString (clearString) {
  var len = clearString.length;
  var cryptString = "";
  var char;
  var index;
  for (i=0; i<len; i=i+1) {
    char = clearString.charAt( i).toUpperCase();
    index = clearAlphabet.indexOf( char);
    if (index == -1) { // not found
      if (char == " ") {
        cryptString = cryptString + "  "; // just 2 as one should already be there
      } else {
        //ignor it.
        //cryptString = cryptString + "_" + char + "_";
      }
    } else {
      cryptString = cryptString + morseSymbols[ index] + " ";
    }
  }
  return cryptString;
}


function morseDecryptString (cryptString) {
  /* symbols are separated by one space, words by three spaces */
  //console.log ("pDS: " + cryptString) 
  var len = cryptString.length;
  var lenSym = morseSymbols.length;
  var clearString = "";
  while (cryptString.length > 0) {
    if (cryptString.charAt(0) == " ") {
      clearString = clearString + " ";
      while (cryptString.charAt(0) == " ") {
        cryptString = cryptString.slice(1)
      }
    } else {
      var index = cryptString.indexOf(" ")
      var symbol =  cryptString.slice(0,index)
      cryptString = cryptString.slice(index+1)
      //console.log ("mDS symbol: " + symbol) 
      for (j=0; j<lenSym; j=j+1) {
        if (symbol == morseSymbols[ j]) {
          index = j;
          j = lenSym +2; // force exit
        }
      }
      if (j == lenSym) {
        // string not found
        clearString = clearString + "_??_";
      } else {
        clearString = clearString + clearAlphabet.charAt(index);
      }
    }
  }
  return clearString;
}


function handleEncrypt () {
  var clearText = document.getElementById('clearText').value; 
  var target = document.getElementById('encryptedText')
  if (clearText.length == 0) {
    target.value = "Please enter clear text before encrypting!";
  } else {
    target.value = encryptionFunction (clearText)
  }
}


function handleDecrypt () {
  var encryptedText = document.getElementById('encryptedText').value; 
  var target = document.getElementById('decryptedText');
  if (encryptedText.length == 0) {
    target.value = "Please enter clear text before encrypting!";
  } else {
    target.value = decryptionFunction (encryptedText)
  }
}


function handleTechniqueSelect () {
  var select = document.getElementById("Technique");
  switch (select.value) {
    case "setupCaesar":
      setupCaesar();
      break;
    case "setupPigPen":
      setupPigPen();
      break;
    case "setupLogFence":
      setupLogFence();
      break;
    case "setupMorseCode":
      setupMorseCode();
      break;
    default:
      setupCaesar();
      break;
  }
}


function setupCaesar () {
  encryptionFunction = caesarEncryptString;
  decryptionFunction = caesarDecryptString;
}


function setupPigPen () {
  encryptionFunction = pigpenEncryptString;
  decryptionFunction = pigpenDecryptString;
}


function setupLogFence () {
  encryptionFunction = logFenceEncryptString;
  decryptionFunction = logFenceDecryptString;
}


function setupMorseCode () {
  encryptionFunction = morseEncryptString;
  decryptionFunction = morseDecryptString;
}


//****
//**** MAIN
//****

function setupHTML () {
  document.getElementById("encryptButton").onclick = handleEncrypt;
  document.getElementById("decryptButton").onclick = handleDecrypt;
  var select = document.getElementById("Technique");

  var option1 = document.createElement("option");
  option1.text = "Caeser Cypher";
  option1.value = "setupCaeser";
  option1.selected = true;
  select.add (option1);
  setupCaesar();

  var option2 = document.createElement("option");
  option2.text = "Pig Pen";
  option2.value = "setupPigPen";
  select.add (option2);

  var option3 = document.createElement("option");
  option3.text = "Log Fence";
  option3.value = "setupLogFence";
  select.add (option3);

  var option4 = document.createElement("option");
  option4.text = "Morse Code";
  option4.value = "setupMorseCode";
  select.add (option4);

  select.onchange = handleTechniqueSelect;

  // fill the default values for the text boxes
  document.getElementById("clearText").value =
      "The quick brown fox jumped over the lazy dog's tail.";
  document.getElementById("decryptedText").value = "";
  document.getElementById("encryptedText").value = "";
}

window.onload = setupHTML;

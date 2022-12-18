import { readFile } from 'fs';


export enum FormatterMode {
  normal,
  owo,
  lolcat,
  sarcastic
}


export class StringFormatter {
  mode: FormatterMode;

  private static owo = {
    postfixes: ["uwu", "owo", ">w<", "nyaa~", "UwU", "OwO", "~~", "uwu~", "owo~", "UwU~", "OwO~", "*nuzzles~", "rawr x3", "o3o", "*rubb~", "mmmm~", ";)", "˶◕‿◕˶", ">////<"]
  };
  private static lolcat = {
    dictionary: {
      full: new Map([
        ['ing', 'in'],
        ['ph', 'f'],
        ['ck', 'k'],
        ['done', 'dun'],
        ['have', 'has'],
        ['hi', 'hai'],
        ['hello', 'oh hai'],
        ['your', 'ur'],
        ['please', 'plz'],
        ['thanks', 'thx'],
        ['bye', 'kthxbye'],
        ['can i', 'can i has'],
        ['enough', 'enuf'],
        ['untill', 'till'],
        ['did', 'does'],
        ['what', 'wut'],
        ['are', 'r'],
        ['you', 'u'],
        ['help', 'halp'],
        ['humans', 'hoomins'],
        ['and', 'n'],
        ['how', 'howz'],
        [',', ''],
        ['\'', ''],
        ['im', 'iz'],
        ['cat', 'kitten'],
        ['with', 'wif'],
        ['them', 'dem'],
        ['their', 'dem'],
        ['for', '4']
      ]),
      end: new Map([
        ['s', 'z'],
        ['ss', 's'],
        ['tion', 'shun'],
        ['sion', 'shun'],
        ['ed', 'd'],
        ['no', 'noes'],
        ['pla', 'pwa']
      ])
    }
  };

  constructor(mode: FormatterMode = FormatterMode.normal) {
    this.mode = mode;
    // readFile('./../assets/lolcat.json', (err, data)=>{
    //   data.toJSON()
    // })
  }

  /**
   * Formats using currect mode
   */
  format(text: string, postfix: boolean = true) {
    switch (this.mode) {
      case FormatterMode.owo:
        //https://github.com/Godlander/Botlander/blob/main/commands/quowote.js
        var txt = text;

        let pos1 = txt.indexOf('<');
        if (pos1 !== -1) {
          let pos2 = txt.indexOf('<');
          if (pos2) {
            txt.substring(pos1, pos2);

          }
        }

        //stylize text
        txt = txt.replace(/u(?!w)/g, "uw");
        txt = txt.replace(/(?<!w|\b)(l|r)(?!w|\b)/g, "w");
        txt = txt.replace(/n(?=a|e|i|o|u)/gi, "ny");
        txt = txt.replace(/\bthe\b/gi, "da");
        txt = txt.replace(/\bthat\b/gi, "dat");
        txt = txt.replace(/\bthis\b/gi, "dis");
        txt = txt.replace(/\bis\b/gi, "iz");
        txt = txt.replace(/\bim\b|\bi'm\b|\bi am\b|bi’m\b/gi, "watashi");
        txt = txt.replace(/\bhi\b|\bhello\b|\bsup\b/gi, "moshi moshi");

        //stuttering function
        function stutter(_txt: string): string {
          return _txt.replace(/\b[a-zA-Z]/g, (str) => { //happens at first letter of each word
            if (Math.floor(Math.random() * 4) == 0) { //1/4 chance to stutter
              var stutter = str;
              for (var i = 0; i < Math.floor(Math.random() * 3); i++) { //stutters 0-2 times
                stutter = stutter + "-" + str;
              }
              return stutter;
            }
            //original string if didnt stutter
            else return str;
          });
        };
        txt = stutter(txt);

        if (postfix) {
          //add a random owo postfix
          txt = txt + "  " + StringFormatter.owo.postfixes[Math.floor(Math.random() * StringFormatter.owo.postfixes.length)];
        }

        return txt;

      case FormatterMode.lolcat:
        var txt = text.toLocaleLowerCase();

        StringFormatter.lolcat.dictionary.full.forEach((v, k) => {
          txt = txt.replace(new RegExp(k, 'g'), v);
        });

        var words = txt.split(' ');
        txt = '';

        words.forEach((w) => {
          StringFormatter.lolcat.dictionary.full.forEach((v, k) => {
            if (w.endsWith(k)) w = w.replace(new RegExp(k, 'g'), v);
          });
          txt += w + ' ';
        });
        txt = txt.substring(0, txt.length - 1); // remove extra space

        return txt;

      case FormatterMode.sarcastic:
        var output = '';
        for (let i = 0; i < text.length; i++) {
          output += (i % 2 === 0 || Math.random() < 0.2) ? text[i] : text[i].toLocaleUpperCase();
        }
        return output;

      default:
        // normal
        return text;
    }
  }

  /**
   * Formats using current mode but respects special Discord text format types
   */
  formatD(text: string, postfix: boolean = true): string {
    // seperate Discord special types (mentions, emojis)
    var formParts: string[] = [];
    var permParts: string[] = [];
    var txt = text;
    var result = '';

    do {
      var pos1 = txt.indexOf('<');
      if (pos1 !== -1) {
        let pos2 = txt.indexOf('>');
        if (pos2) {
          permParts.push(txt.substring(pos1, pos2 + 1));
          formParts.push(txt.substring(0, pos1));
          txt = txt.substring(pos2 + 1);
          continue;
        }
      }
      formParts.push(txt);
    } while (pos1 !== -1);

    // format and reassemble
    for (let i = permParts.length; i > 0; i--) {
      if (formParts.length !== 0) result += this.format(formParts.shift()!, false);
      result += permParts.shift();
    }
    if (formParts.length !== 0) result += this.format(formParts.shift()!, postfix);

    return result;
  }
}
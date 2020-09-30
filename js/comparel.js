const Counter = {
    data() {
      return {
        counter: 0,
        deck1: '',
        deck2: '',
        onlyDeck1: '',
        onlyDeck2: '',
        common: ''
      }
    },
    methods: {
        updateList() {
            
            this.onlyDeck2 = createListDict(this.deck2)
            console.log(intersect(this.onlyDeck1, this.onlyDeck2))
            this.common = intersectDict(createListDict(this.deck1), this.onlyDeck2)
            this.onlyDeck1 = diffDict(createListDict(this.deck1), this.common)

        }
    }
  }
  
  Vue.createApp(Counter).mount('#mainApp')
  

function createListDict(text_field) {
    field_list = text_field.split('\n')
    field_dict = {}
    field_list.forEach(line => {
        if (/^\d+x?/.test(line)) {
            qty = parseInt(line.match(/^(\d+)x?/)[1]);
        }
        else {
            qty = 1
        }
        
        name = line.replace(/^\d+x?\s*/, '');

        if (name.length > 0) {

            if (field_dict[name] === undefined) {
                field_dict[name] = 0;
            }
            field_dict[name] += qty;
            console.log(line)
        }
    });

    return field_dict
}

function intersect(o1, o2) {

  const [k1, k2] = [Object.keys(o1), Object.keys(o2)];
  const [first, next] = k1.length > k2.length ? [k2, o1] : [k1, o2];
  return first.filter(k => k in next);
}

function intersectDict(d1, d2) {

  common_keys = intersect(d1, d2)
  return Object.assign({}, ...common_keys.map((element) => ({[element]: Math.min(d1[element],d2[element])})))

}

function diffDict(d1, d2) {
  result = []
  for (chiave in d1) {
      if (chiave in d2) {
          if (d1[chiave] > d2[chiave]) {
              result.push({[chiave]:d1[chiave] - d2[chiave]})
          }
      }
      else {
          result.push({[chiave]:d1[chiave]})
      }
  }
    return result
}


  document.getElementById('compare').onclick = function() {
  var deck1Lines = document.getElementById('deck1').value.split('\n'),
      deck2Lines = document.getElementById('deck2').value.split('\n'),
      deck1Cards = {},
      deck2Cards = {};
  
  _.each(deck1Lines, (str) => {
  	let num = 1;
  	if (/^\d+x?/.test(str)) {
    	num = parseInt(str.match(/^(\d+)x?/)[1]);
      str = str.replace(/^\d+x?\s*/, '');
    }
    if (deck1Cards[str] === undefined) {
    	deck1Cards[str] = 0;
    }
    deck1Cards[str] += num;
  });
  
  _.each(deck2Lines, (str) => {
  	let num = 1;
  	if (/^\d+x?/.test(str)) {
    	num = parseInt(str.match(/^(\d+)x?/)[1]);
      str = str.replace(/^\d+x?\s*/, '');
    }
    if (deck2Cards[str] === undefined) {
    	deck2Cards[str] = 0;
    }
    deck2Cards[str] += num;
  });
  
  let cardsInBoth = _.intersection(_.keys(deck1Cards), _.keys(deck2Cards)),
  		cardsInDeck1Only = _.difference(_.keys(deck1Cards), cardsInBoth),
  		cardsInDeck2Only = _.difference(_.keys(deck2Cards), cardsInBoth),
      changes = {};
  
  _.each(cardsInDeck1Only, (c) => { changes[c] = -deck1Cards[c]; });
  _.each(cardsInDeck2Only, (c) => { changes[c] = deck2Cards[c]; });
  _.each(cardsInBoth, (c) => { changes[c] = deck2Cards[c] - deck1Cards[c]; });
  
  let resultDiv = document.getElementById('results'),
  		resultText = [];
  _.each(changes, (v, n) => {
  	resultText.push(`<span class="${v === 0 ? 'unchanged' : (v > 0 ? 'added' : 'removed')}${v < 0 && v === -deck1Cards[n] ? ' total' : ''}"><span class="number">${v === 0 ? `=${deck1Cards[n]}x` : `${v > 0 ? '+' : ''}${v}x`}</span>${n}</span>`);
  });
  resultDiv.innerHTML = resultText.join('<br>');
}
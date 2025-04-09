import json
import genanki


with open('characters.json', 'r', encoding='utf-8') as f:
    hanzi_data = json.load(f)

my_model = genanki.Model(
    1607392319,
    'Hanzi Model',
    fields=[
        {'name': 'Hanzi'},
        {'name': 'Pinyin'},
        {'name': 'Meaning'},
    ],
    templates=[
        {
            'name': 'Card 1',
            'qfmt': '''
                <div class="hanzi">{{Hanzi}}</div>
            ''',
            'afmt': '''
                {{FrontSide}}
                <hr id="answer">
                <div class="pinyin">{{Pinyin}}</div>
                <div class="meaning">{{Meaning}}</div>
            ''',
        },
    ],
    css='''
        /* Embed custom font */
        @font-face {
            font-family: "CustomHanziFont";
            src: url("FZKai-Z03S-Regular.ttf");
        }
        .hanzi {
            font-family: "CustomHanziFont";
            font-size: 48px;
            text-align: center;
        }
        .pinyin {
            font-size: 24px;
            color: blue;
        }
        .meaning {
            font-size: 18px;
        }
    '''
)


my_deck = genanki.Deck(2059400110, '汉字')
for hanzi, info in hanzi_data.items():
    my_note = genanki.Note(
        model=my_model,
        fields=[hanzi, info['pinyin'], info['meaning']]
    )
    my_deck.add_note(my_note)

package = genanki.Package(my_deck)
package.media_files = ['./fonts/FZKai-Z03S-Regular.ttf']

package.write_to_file('hanzi_deck.apkg')
print("Deck created with custom font! 🎉")
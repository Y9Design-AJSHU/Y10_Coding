import tkinter as tk
from googletrans import Translator
from bs4 import BeautifulSoup
import requests
import json
from tkinter.ttk import *
from tkinter import ttk
from tkinter import messagebox

master = tk.Tk()
style2 = ttk.Style()
style2.theme_use('default')

style2.configure("2orange.horizontal.TEntry", foreground='#ff8f00', font=("System", 20))
style2.configure("2orange.TButton", background='#ff8f00',foreground="black", font=("System", 20))
style2.configure("2orange.TLabel", foreground='#ff8f00',background="white", font=("System", 20))
style2.configure("2orange.TMenubutton", foreground='#ff8f00',background="white", width="5", font=("System", 20))

languages = {
	'af': 'afrikaans',
	'sq': 'albanian',
	'am': 'amharic',
	'ar': 'arabic',
	'hy': 'armenian',
	'az': 'azerbaijani',
	'eu': 'basque',
	'be': 'belarusian',
	'bn': 'bengali',
	'bs': 'bosnian',
	'bg': 'bulgarian',
	'ca': 'catalan',
	'ceb': 'cebuano',
	'ny': 'chichewa',
	'zh-cn': 'chinese (simplified)',
	'zh-tw': 'chinese (traditional)',
	'co': 'corsican',
	'hr': 'croatian',
	'cs': 'czech',
	'da': 'danish',
	'nl': 'dutch',
	'en': 'english',
	'eo': 'esperanto',
	'et': 'estonian',
	'tl': 'filipino',
	'fi': 'finnish',
	'fr': 'french',
	'fy': 'frisian',
	'gl': 'galician',
	'ka': 'georgian',
	'de': 'german',
	'el': 'greek',
	'gu': 'gujarati',
	'ht': 'haitian creole',
	'ha': 'hausa',
	'haw': 'hawaiian',
	'iw': 'hebrew',
	'hi': 'hindi',
	'hmn': 'hmong',
	'hu': 'hungarian',
	'is': 'icelandic',
	'ig': 'igbo',
	'id': 'indonesian',
	'ga': 'irish',
	'it': 'italian',
	'ja': 'japanese',
	'jw': 'javanese',
	'kn': 'kannada',
	'kk': 'kazakh',
	'km': 'khmer',
	'ko': 'korean',
	'ku': 'kurdish (kurmanji)',
	'ky': 'kyrgyz',
	'lo': 'lao',
	'la': 'latin',
	'lv': 'latvian',
	'lt': 'lithuanian',
	'lb': 'luxembourgish',
	'mk': 'macedonian',
	'mg': 'malagasy',
	'ms': 'malay',
	'ml': 'malayalam',
	'mt': 'maltese',
	'mi': 'maori',
	'mr': 'marathi',
	'mn': 'mongolian',
	'my': 'myanmar (burmese)',
	'ne': 'nepali',
	'no': 'norwegian',
	'ps': 'pashto',
	'fa': 'persian',
	'pl': 'polish',
	'pt': 'portuguese',
	'pa': 'punjabi',
	'ro': 'romanian',
	'ru': 'russian',
	'sm': 'samoan',
	'gd': 'scots gaelic',
	'sr': 'serbian',
	'st': 'sesotho',
	'sn': 'shona',
	'sd': 'sindhi',
	'si': 'sinhala',
	'sk': 'slovak',
	'sl': 'slovenian',
	'so': 'somali',
	'es': 'spanish',
	'su': 'sundanese',
	'sw': 'swahili',
	'sv': 'swedish',
	'tg': 'tajik',
	'ta': 'tamil',
	'te': 'telugu',
	'th': 'thai',
	'tr': 'turkish',
	'uk': 'ukrainian',
	'ur': 'urdu',
	'uz': 'uzbek',
	'vi': 'vietnamese',
	'cy': 'welsh',
	'xh': 'xhosa',
	'yi': 'yiddish',
	'yo': 'yoruba',
	'zu': 'zulu',
	'fil': 'filipino',
	'he': 'hebrew'
}
errorYes = False
def lyrics(artist, song):
	global errorYes
	base = "https://www.azlyrics.com/"
	artist = artist.lower().replace(" ", "")
	song = song.lower().replace(" ", "")
	
	url = base+"lyrics/"+artist+"/"+song+".html"

	req = requests.get(url)
	soup = BeautifulSoup(req.content, "html.parser")
	lyrics = soup.find_all("div", attrs={"class": None, "id": None})
	if not lyrics:
		errorYes = True
	elif lyrics:
		lyrics = [x.getText() for x in lyrics]
		return lyrics
		errorYes = False

def translateNow():
	master2 = tk.Tk()
	lyricsText = tk.StringVar(master2)
	labelLyrics = tk.Label(master2, textvariable=lyricsText, font=('System', 10))
	labelLyrics.grid(column=0, row=0, columnspan=3)	
	
	
	songT = songTitle.get()
	artistT= artistTitle.get()
	wd = lyrics(artistT, songT)
	print(artistT, songT)
	translator = Translator()
	lang = langOptMenu.get()
	def get_key(val): 
		for key, value in languages.items(): 
			if val == value: 
				return key 
		return "key doesn't exist"
	translations = translator.translate([str(wd)], get_key(lang.lower()))

	for translation in translations:
		#lyricsBefore= translation.origin, ' -> ', translation.text
		
		
		lyricsBefore = translation.text
		lyricsBefore = lyricsBefore.replace("{", "")
		lyricsBefore = lyricsBefore.replace("}", "")
		lyricsBefore = lyricsBefore.replace("\ r", "\r")
		lyricsBefore = lyricsBefore.replace('["', '')
		lyricsBefore = lyricsBefore.replace("}", "")
		lyricsBefore = lyricsBefore.replace("\ n", '\n')
		lyricsBefore = lyricsBefore.replace("['", "")
		lyricsBefore = lyricsBefore.replace("']", "")
		lyricsBefore = lyricsBefore.replace('"]', '')

		if errorYes:
			master2.destroy()
			messagebox.showerror(title="Song Not Found", message="Please enter another song, that song wasn't found")
		elif not errorYes:
			lyricsText.set(lyricsBefore)
			print(translation.origin)

langListLow=list(languages.values())
langList=[]
for i in langListLow:
	langList.append(i.title())
	
langOptMenu = tk.StringVar(master)
langOptMenu.set(langList[0])

Label(master, text="Enter the Song Title:", style="2orange.TLabel").grid(row=0, column=0, pady='5px', padx='10px')
Label(master, text="Enter the Artist:", style="2orange.TLabel").grid(row=1, column=0, pady='5px', padx='10px')
Label(master, text="Enter the Destination Language:", style="2orange.TLabel").grid(row=2, column=0, pady='5px', padx='10px')
lang = ttk.OptionMenu(master, langOptMenu, *langList, style="2orange.TMenubutton")
songTitle = Entry(master, width=15,style='2orange.horizontal.TEntry',font=("System", 20))
artistTitle = Entry(master, width=15,style='2orange.horizontal.TEntry',font=("System", 20))
Button(master, text="Translate", command=translateNow, style='2orange.TButton').grid(row=3, column=0, columnspan=2, pady='10px', padx='10px')

lang.config(width=15)
songTitle.config(width=15)
artistTitle.config(width=15)
songTitle.grid(row=0, column=1, pady='5px', padx='10px')
artistTitle.grid(row=1, column=1, pady='5px', padx='10px')
lang.grid(row=2, column=1, pady='5px', padx='10px')


	
tk.mainloop()

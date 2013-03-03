import math
import random

class character():
	def __init__(self,unit_number,team):
		self.name = team + " " + str(unit_number)
		self.team = team
		self.level = 1.0
		self.xp = 0.0
		self.max_hp = 100.0
		self.dexterity = 10.0
		self.strength = 10.0
		self.kills = 0
		
		self.current_hp = 100.0
		
	def update_stats(self):
		self.max_hp = 100.0 + 10.0*(self.level-1.0)
		self.dexterity = 10.0+(1.0*(self.level-1.0))
		self.strength = 10.0+(1.0*(self.level-1.0))
		
	def update_level(self):
		if self.xp >= 2**self.level:
			self.xp -= 2**self.level
			self.level += 1
			self.update_stats()
			#print "Character ",self.name," has reached level ",self.level
			
	def heal_to_full(self):
		self.current_hp = self.max_hp
		
	def get_xp(self,killed):
		self.xp += killed.level
		self.kills += 1
		self.update_level()

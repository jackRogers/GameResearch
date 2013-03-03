import math
import random

class duel():
	def __init__(self,A,B):
		self.a = A
		self.b = B
		self.winner = None
		
	def one_tick(self):
		#50% chance A attacks first
		if random.random() >= 0.5:
			#A attacks first
			a_hit_chance = ((self.a.dexterity/self.b.dexterity)*self.a.dexterity)/100.0
			if a_hit_chance >= random.random():
				#a hits
				self.b.current_hp -= random.uniform(1,self.a.strength)
				if self.b.current_hp > 0:
					#b surives attacks and tries to hit back
					b_hit_chance = ((self.b.dexterity/self.a.dexterity)*self.b.dexterity)/100.0
					if b_hit_chance >= random.random():
						#b hits back successfully
						self.a.current_hp -= random.uniform(1,self.b.strength)
						if self.a.current_hp < 0:
							#b kills a
							self.winner = self.b
							self.b.get_xp(self.a)
				else:
					#a kills b
					self.winner = self.a
					self.a.get_xp(self.b)
		else:
			#B attacks first
			b_hit_chance = ((self.b.dexterity/self.a.dexterity)*self.b.dexterity)/100.0
			if b_hit_chance >= random.random():
				#B hits
				self.a.current_hp -= random.uniform(1,self.b.strength)
				if self.a.current_hp > 0:
					#a survives and attacks back
					a_hit_chance = ((self.a.dexterity/self.b.dexterity)*self.a.dexterity)/100.0
					if a_hit_chance >= random.random():
						#a hits
						self.b.current_hp -= random.uniform(1,self.a.strength)
						if self.b.current_hp < 0:
							#a kills b
							self.winner = self.a
							self.a.get_xp(self.b)
				else:
					#b kills a
					self.winner = self.b
					self.b.get_xp(self.a)

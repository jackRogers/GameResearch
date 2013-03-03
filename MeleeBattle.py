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
		
class battle():
	def __init__(self,A,B):
		self.A_starting_units = len(A)
		self.B_starting_units = len(B)
		
		self.A = A
		self.B = B
		
		self.max_duels = min(len(A),len(B))
		self.duels = []
		
		self.winner = None
		
		#while noone has lost
		#this loop continues until one team has lost more than 50% of its units
		while len(self.A)+len(self.duels)>= self.A_starting_units/2.0 and len(self.B)+len(self.duels)>= self.B_starting_units/2.0:
			#assign max number of duels
			self.assign_max_duels()
			#advance each duel 1 tick
			self.all_duels_one_tick()
			#end duels properly
			self.recycle_ended_duels()
		
		while len(self.duels) > 0:
			self.all_duels_one_tick()
			self.recycle_ended_duels()
			
		#print winner and losses and such
		self.print_winner()
		
	def assign_max_duels(self):
		self.max_duels = min(len(self.A),len(self.B))
		duels_to_make = self.max_duels
		while duels_to_make > 0:
			
			a = random.randint(0,len(self.A)-1)
			b = random.randint(0,len(self.B)-1)
			self.duels.append(duel(self.A.pop(a),self.B.pop(b)))	
			duels_to_make -= 1	
		
	def all_duels_one_tick(self):
		for i in self.duels:
			i.one_tick()
		
	def recycle_ended_duels(self):
		for i in self.duels:
			if i.winner != None:
				if i.winner.team == 'a':
					self.A.append(i.winner)
				else:
					self.B.append(i.winner)
				self.duels.pop(self.duels.index(i))
				
	def print_winner(self):
		if len(self.A) > len(self.B):
			print "TEAM A WINS"
			self.winner = 'a'
		else:
			print "TEAM B WINS"
			self.winner = 'b'
		
	def print_stats(self):
		print "\n team A roster"
		print len(self.A), ' units total'
		print 'Name\tlevel\tkills'
		for i in self.A:
			if i.kills > 0:
				print i.name,'\t',i.level,'\t',i.kills
			
		print "\n team B roster"
		print len(self.B), ' units total'
		print 'Name\tlevel\tkills'
		for i in self.B:
			if i.kills > 0:
				print i.name,'\t',i.level,'\t',i.kills
				
def main():
	army_size_input = input("Enter size of both armies: ")
	
	#initialize two armies with n soldiers
	A = [character(i,'a') for i in range(army_size_input)]
	B = [character(i,'b') for i in range(army_size_input)]
	
	number_of_battles_input = input("Enter number of battles to fight: ")
	
	A_count = army_size_input
	B_count = army_size_input
	
	A_wins = 0
	B_wins = 0
	
	#N times
	for i in range(number_of_battles_input):
		print "\nBattle ",i," has begun"
		current_battle = battle(A,B)	
		A = current_battle.A
		B = current_battle.B
		if current_battle.winner == 'a':
			A_wins += 1
		else:
			B_wins += 1
		
		#heal all surviving units
		for i in A:
			i.heal_to_full()
		for i in B:
			i.heal_to_full()
			
		#replace dead units with level 1 units
		while len(A) < army_size_input:
			A_count += 1
			A.append(character(A_count,'a'))
		while len(B) < army_size_input:
			B_count += 1
			B.append(character(B_count,'b'))
			
	#output
	print "Army A won ", A_wins, " times"
	print "Army B won ", B_wins, " times"
	raw_input('Enter to see player stats')
	current_battle.print_stats()
	raw_input('Enter to quit')

main()

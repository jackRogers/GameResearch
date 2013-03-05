import math
import random
import Character
import Duel
import Interface
import Data

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
			self.duels.append(Duel.duel(self.A.pop(a),self.B.pop(b)))	
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
				

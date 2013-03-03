import curses
import Battle
import Duel
import Character
import Data
import Battle

data = Data.data()

def get_param(screen,prompt_string):
	screen.clear()
	screen.border(0)
	screen.addstr(2, 2, prompt_string)
	screen.refresh()
	input = screen.getstr(10, 10, 60)
	return input

def army_A_constructor(screen):
	army_A_initial_recruit_count = get_param(screen,"Enter number of units to initialize army A")
	data.Army_A = [Character.character(i,'a') for i in range(int(army_A_initial_recruit_count))]
	data.Army_A_max_size = len(data.Army_A)
	
def army_B_constructor(screen):
	army_B_initial_recruit_count = get_param(screen,"Enter number of units to initialize army B")
	data.Army_B = [Character.character(i,'b') for i in range(int(army_B_initial_recruit_count))]
	data.Army_B_max_size = len(data.Army_B)


def main_menu():
	x = 0
	while x != ord('6'):
		screen = curses.initscr()
		screen.clear()
		screen.border(0)
		screen.addstr(2, 2, "Please enter a number...")
		screen.addstr(4, 4, "1 - Create Army A")
		screen.addstr(5, 4, "2 - Create Army B")
		screen.addstr(6, 4, "3 - Fight N Battles")
		screen.addstr(7, 4, "4 - Look at Roster of Army A")
		screen.addstr(8, 4, "5 - Look at Roster of Army B")
		screen.addstr(9, 4, "6 - Exit")
		screen.refresh()
		x = screen.getch()
		if x == ord('1'):
			screen.clear()
			screen.border(0)
			army_A_constructor(screen)
			main_menu()
		if x == ord('2'):
			screen.clear()
			screen.border(0)
			army_B_constructor(screen)
			main_menu()
		if x == ord('3'):
			number_of_battles_input = get_param(screen,"Enter number of units to initialize army B")
			for i in range(int(number_of_battles_input)):
				print "\nBattle ",i," has begun"
				current_battle = Battle.battle(data.Army_A,data.Army_B)	
				data.Army_A = current_battle.A
				data.Army_B = current_battle.B
				if current_battle.winner == 'a':
					data.A_wins += 1
				else:
					data.B_wins += 1
				
				#heal all surviving units
				for i in data.Army_A:
					i.heal_to_full()
				for i in data.Army_B:
					i.heal_to_full()
					
				#replace dead units with level 1 units
				while len(data.Army_A) < data.Army_A_max_size:
					data.A_count += 1
					data.Army_A.append(Character.character(data.A_count,'a'))
				while len(data.Army_B) < data.Army_B_max_size:
					data.B_count += 1
					data.Army_B.append(Character.character(data.B_count,'b'))
		if x == ord('4'):
			print "\n team A roster"
			print len(data.Army_A), ' units total'
			print 'Name\tlevel\tkills'
			for i in data.Army_A:
				if i.kills > 0:
					print i.name,'\t',i.level,'\t',i.kills
			raw_input("press enter")
			main_menu()
			
		if x == ord('5'):
			print "\n team B roster"
			print len(data.Army_B), ' units total'
			print 'Name\tlevel\tkills'
			for i in data.Army_B:
				if i.kills > 0:
					print i.name,'\t',i.level,'\t',i.kills
			raw_input("press enter")
			main_menu()
			
main_menu()
curses.endwin()


import curses
import Battle
import Duel
import Character
import Data
import Battle

def get_param(prompt_string):
	screen.clear()
	screen.border(0)
	screen.addstr(2, 2, prompt_string)
	screen.refresh()
	input = screen.getstr(10, 10, 60)
	return input

def main():
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
			army_A_initial_recruit_count = get_param("Enter number of units to initialize army A")
		if x == ord('2'):
			pass
		if x == ord('3'):
			pass
		if x == ord('4'):
			pass
		if x == ord('5'):
			pass

curses.endwin()


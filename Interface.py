
#!/usr/bin/env python

from os import system
import curses

def get_param(prompt_string):
     screen.clear()
     screen.border(0)
     screen.addstr(2, 2, prompt_string)
     screen.refresh()
     input = screen.getstr(10, 10, 60)
     return input

while x != ord('4'):
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
          username = get_param("Enter the username")
          homedir = get_param("Enter the home directory, eg /home/nate")
          groups = get_param("Enter comma-separated groups, eg adm,dialout,cdrom")
          shell = get_param("Enter the shell, eg /bin/bash:")
          curses.endwin()
          execute_cmd("useradd -d " + homedir + " -g 1000 -G " + groups + " -m -s " + shell + " " + username)
     if x == ord('2'):
          curses.endwin()
          execute_cmd("apachectl restart")
     if x == ord('3'):
          curses.endwin()
          execute_cmd("df -h")

curses.endwin()

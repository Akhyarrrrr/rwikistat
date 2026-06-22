@echo off
Rscript -e "shiny::runApp('%1', host = '127.0.0.1', port = %2)"
pause
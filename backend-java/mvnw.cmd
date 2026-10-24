@echo off
if exist "C:\Users\ranul\tools\apache-maven-3.9.6\bin\mvn.cmd" (
    call "C:\Users\ranul\tools\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    mvn %*
)

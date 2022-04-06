cat /sys/class/thermal/thermal_zone0/temp
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print $1"%"}'
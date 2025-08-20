#!/bin/bash
cd /home/kavia/workspace/code-generation/student-attendance-tracker-8813/attendance_frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


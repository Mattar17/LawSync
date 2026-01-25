!include "MUI2.nsh"

!define MUI_ABORTWARNING

; --------------------
; Installer pages ONLY
; --------------------
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

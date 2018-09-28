示例1（应用程序.exe，客户端安装）：

;{089D6802-6CD3-4E45-B8D5-AC9ED99CE371}; 脚本由 Inno Setup 脚本向导 生成！
; 有关创建 Inno Setup 脚本文件的详细资料请查阅帮助文档！

[Setup]
; 注: AppId的值为单独标识该应用程序。
; 不要为其他安装程序使用相同的AppId值。
; (生成新的GUID，点击 工具|在IDE中生成GUID。)
AppId={{5E012E21-42EE-4840-A000-35F9FAB886E9}
AppName=AIS_Client
AppVerName=AIS_Client
AppPublisher=公司名

DefaultDirName={pf}\AIS_Client
DefaultGroupName=AIS_Client
OutputBaseFilename=AIS_Client
Compression=lzma
SolidCompression=yes
SetupIconFile=D:\AIS\AIS 打包程序\AISGUI.ico
LicenseFile=C:\Documents and Settings\Administrator\桌面\许可协议.txt

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "D:\AIS\AIS 打包程序\AIS_client_exe\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; 注意: 不要在任何共享系统文件上使用“Flags: ignoreversion”

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Icons]
Name: "{group}\AIS客户端"; Filename: "{app}\AISGUI.exe"
Name: "{group}\AIS客户端参数配置工具"; Filename: "{app}\ClientConfig.exe"
Name: "{group}\AIS服务设置工具"; Filename: "{app}\ServiceIPManage.exe"
Name: "{group}\AIS数据库参数配置工具"; Filename: "{app}\DataBaseConfig.exe"
;Name: "{group}\门控服务端"; Filename: "{app}\Access_server\SecurityWare.exe"
;在开始菜单->所有程序->伴网书童里添加一个删除快捷键。
Name: "{group}\卸载"; Filename: {uninstallexe}
Name: "{commondesktop}\AIS客户端"; Filename: "{app}\AISGUI.exe"; Tasks: desktopicon
;Name: "{commondesktop}\门控服务端"; Filename: "{app}\Access_server\SecurityWare.exe"; Tasks: desktopicon

[Run]
;Filename: "{app}\Access_server\SecurityWare.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec
Filename: "{app}\AISGUI.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec

[Registry]
;添加开机启动
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName:"ais"; ValueData:"{app}\AISGUI.exe";  Flags:uninsdeletevalue

[Code]
{卸载时判断主程序是否在运行}
var
is_Sys , is_value: integer;
S_syschar, S_currentchar, S_current,S_sys, S,ResultStr : string;
I ,CloseNum: Integer;
ErrorCode: Integer;
Guid_names,window_name : TArrayOfString;
bool  : Boolean;
const AppName='{5E012E21-42EE-4840-A000-35F9FAB886E9}_is1';

{程序安装前判断主程序是否在运行}
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  if RegGetSubkeyNames(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',Guid_names) then
  begin
    for I:=0 to GetArrayLength(Guid_names)-1 do
    begin
      S := Guid_names[i];
      //注册表中找到了此键
      if AppName=Guid_names[i] then
      begin
        bool := RegQueryStringValue(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\'+S,'UninstallString',ResultStr);
        //ResultStr := RemoveQuotes(ResultStr);
        if bool then
        begin
          if MsgBox('安装程序检测到当前计算机已经安装了AIS客户端。' #13#13 '您是否要卸载AIS客户端？',  mbConfirmation, MB_YESNO) = IDYES then
            //   ShellExec('', ExpandConstant('{app}\unins000.exe'), '','', SW_SHOW, ewNoWait, ResultCode);
            begin
              Exec(RemoveQuotes(ResultStr), '', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
              Result := false;
            end
        end
        break;
      end
      else
      //zdx 5.8 判断是否已经打开了一个安装程序
      begin
        if FindWindowbyWindowName('安装 - AIS_Client')<>0 then
        begin
          MsgBox('安装程序检测到有另外一个安装程序已经在运行了', mbConfirmation, MB_OK);
          Result := false;
          break;
        end
      end
    end;
    if I= GetArrayLength(Guid_names) then
      Result := true;
  end
  else
    Result := true;
end;

//当用户单击cancel的时候，删除掉拷贝到系统的文件夹
procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
end ;

//卸载密码验证函数
function AskPassword(): Boolean;
var
   Form: TSetupForm;
   OKButton, CancelButton: TButton;
   PwdEdit: TPasswordEdit;
begin
   Result := false;
   Form := CreateCustomForm();
   try
Form.ClientWidth := ScaleX(256);
Form.ClientHeight := ScaleY(100);
Form.Caption := '密码验证';
Form.BorderIcons := [biSystemMenu];
Form.BorderStyle := bsDialog;
Form.Center;

OKButton := TButton.Create(Form);
OKButton.Parent := Form;
OKButton.Width := ScaleX(75);
OKButton.Height := ScaleY(23);
OKButton.Left := Form.ClientWidth - ScaleX(75 + 6 + 75 + 50);
OKButton.Top := Form.ClientHeight - ScaleY(23 + 10);
OKButton.Caption := '确定';
OKButton.ModalResult := mrOk;
OKButton.Default := true;

CancelButton := TButton.Create(Form);
CancelButton.Parent := Form;
CancelButton.Width := ScaleX(75);
CancelButton.Height := ScaleY(23);
CancelButton.Left := Form.ClientWidth - ScaleX(75 + 50);
CancelButton.Top := Form.ClientHeight - ScaleY(23 + 10);
CancelButton.Caption := '取消';
CancelButton.ModalResult := mrCancel;
CancelButton.Cancel := True;

PwdEdit := TPasswordEdit.Create(Form);
PwdEdit.Parent := Form;
PwdEdit.Width := ScaleX(210);
PwdEdit.Height := ScaleY(23);
PwdEdit.Left := ScaleX(23);
PwdEdit.Top := ScaleY(23);

Form.ActiveControl := PwdEdit;

if Form.ShowModal() = mrOk then
begin
   Result := PwdEdit.Text = 'bw12345678';
   if not Result then
         MsgBox('密码错误', mbInformation, MB_OK);
end;
   finally
Form.Free();
   end;
end;

//卸载程序的时候判断是否在运行
function InitializeUninstall(): Boolean;
begin
  begin
  //密码验证
  //Result :=  AskPassword();
  Result := TRUE;
//  DelTree(ExpandConstant('{app}\*'), False, True, True);
  end
end;

//提示卸载完后重启计算机
function UninstallNeedRestart(): Boolean;
begin
   Result := False;
   DelTree(ExpandConstant('{app}\*'), False, True, True);
   DelTree(ExpandConstant('{app}'), True, True, True);
end;

 

示例2（windows service，服务端安装）：

;{089D6802-6CD3-4E45-B8D5-AC9ED99CE371}; 脚本由 Inno Setup 脚本向导 生成！
; 有关创建 Inno Setup 脚本文件的详细资料请查阅帮助文档！

[Setup]
; 注: AppId的值为单独标识该应用程序。
; 不要为其他安装程序使用相同的AppId值。
; (生成新的GUID，点击 工具|在IDE中生成GUID。)
AppId={{D0D0B722-C6F9-4A89-AB56-1417B9BD1400}
AppName=AIS_Server
AppVerName=AIS_Server
AppPublisher=公司名

DefaultDirName={pf}\AIS_Server
DefaultGroupName=AIS_Server
OutputBaseFilename=AIS_Server
Compression=lzma
SolidCompression=yes
SetupIconFile=D:\AIS\AIS 打包程序\AISGUI.ico
LicenseFile=C:\Documents and Settings\Administrator\桌面\许可协议.txt

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "D:\AIS\AIS 打包程序\AIS_server_exe\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; 注意: 不要在任何共享系统文件上使用“Flags: ignoreversion”

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Icons]
Name: "{group}\AIS服务端参数配置工具"; Filename: "{app}\ServiceConfig.exe"
;Name: "{group}\AIS客户端"; Filename: "{app}\AIS_client_exe\AISGUI.exe"
;Name: "{group}\门控服务端"; Filename: "{app}\Access_server\SecurityWare.exe"
;在开始菜单->所有程序->伴网书童里添加一个删除快捷键。
Name: "{group}\卸载"; Filename: {uninstallexe}
;Name: "{commondesktop}\AIS客户端"; Filename: "{app}\AIS_client_exe\AISGUI.exe"; Tasks: desktopicon
;Name: "{commondesktop}\门控服务端"; Filename: "{app}\Access_server\SecurityWare.exe"; Tasks: desktopicon

[Run]
;Filename: "{app}\Access_server\SecurityWare.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec
;Filename: "{app}\AIS_client_exe\AISGUI.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec

[Registry]
;添加开机启动
;Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName:"bwqc"; ValueData:"{app}\MSrv.exe";  Flags:uninsdeletevalue

[Code]
{卸载时判断主程序是否在运行}
var
is_Sys , is_value: integer;
S_syschar, S_currentchar, S_current,S_sys, S,ResultStr : string;
I ,CloseNum: Integer;
ErrorCode: Integer;
Guid_names,window_name : TArrayOfString;
bool  : Boolean;
const AppName='{D0D0B722-C6F9-4A89-AB56-1417B9BD1400}_is1';

{程序安装前判断主程序是否在运行}
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  if RegGetSubkeyNames(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',Guid_names) then
  begin
    for I:=0 to GetArrayLength(Guid_names)-1 do
    begin
      S := Guid_names[i];
      //注册表中找到了此键
      if AppName = Guid_names[i] then
      begin
        bool := RegQueryStringValue(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\'+S,'UninstallString',ResultStr);
        //ResultStr := RemoveQuotes(ResultStr);
        if bool then
        begin
           if MsgBox('安装程序检测到当前计算机已经安装了AIS_Server。' #13#13 '您是否要卸载AIS_Server？',  mbConfirmation, MB_YESNO) = IDYES then
            //   ShellExec('', ExpandConstant('{app}\unins000.exe'), '','', SW_SHOW, ewNoWait, ResultCode);
            begin
              Exec(RemoveQuotes(ResultStr), '', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
              Result := false;
            end
        end
        break;
      end
      else
      //zdx 5.8 判断是否已经打开了一个安装程序
      begin
        if FindWindowbyWindowName('安装 - AIS_Server')<>0 then
        begin
          MsgBox('安装程序检测到有另外一个安装程序已经在运行了', mbConfirmation, MB_OK);
          Result := false;
          break;
        end
      end
    end;
    if I = GetArrayLength(Guid_names) then
      Result := true;
  end
  else
    Result := true;
end;

//当用户单击cancel的时候，删除掉拷贝到系统的文件夹
procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
end ;

//卸载密码验证函数
function AskPassword(): Boolean;
var
   Form: TSetupForm;
   OKButton, CancelButton: TButton;
   PwdEdit: TPasswordEdit;
begin
   Result := false;
   Form := CreateCustomForm();
   try
Form.ClientWidth := ScaleX(256);
Form.ClientHeight := ScaleY(100);
Form.Caption := '密码验证';
Form.BorderIcons := [biSystemMenu];
Form.BorderStyle := bsDialog;
Form.Center;

OKButton := TButton.Create(Form);
OKButton.Parent := Form;
OKButton.Width := ScaleX(75);
OKButton.Height := ScaleY(23);
OKButton.Left := Form.ClientWidth - ScaleX(75 + 6 + 75 + 50);
OKButton.Top := Form.ClientHeight - ScaleY(23 + 10);
OKButton.Caption := '确定';
OKButton.ModalResult := mrOk;
OKButton.Default := true;

CancelButton := TButton.Create(Form);
CancelButton.Parent := Form;
CancelButton.Width := ScaleX(75);
CancelButton.Height := ScaleY(23);
CancelButton.Left := Form.ClientWidth - ScaleX(75 + 50);
CancelButton.Top := Form.ClientHeight - ScaleY(23 + 10);
CancelButton.Caption := '取消';
CancelButton.ModalResult := mrCancel;
CancelButton.Cancel := True;

PwdEdit := TPasswordEdit.Create(Form);
PwdEdit.Parent := Form;
PwdEdit.Width := ScaleX(210);
PwdEdit.Height := ScaleY(23);
PwdEdit.Left := ScaleX(23);
PwdEdit.Top := ScaleY(23);

Form.ActiveControl := PwdEdit;

if Form.ShowModal() = mrOk then
begin
   Result := PwdEdit.Text = 'bw12345678';
   if not Result then
         MsgBox('密码错误', mbInformation, MB_OK);
end;
   finally
Form.Free();
   end;
end;

procedure CurStepChanged(CurStep: TSetupStep);//添加环境变量
var
  ResultCode: Integer;
begin
if CurStep = ssPostInstall  then
 begin
     ShellExec('', ExpandConstant('{app}\ServiceInstall.exe'),
                '-is AIS_server "'+ ExpandConstant('{app}\AIS_server.exe')+'"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
 end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  ResultCode: Integer;
begin
  if CurUninstallStep = usUninstall then
    begin
       ShellExec('', ExpandConstant('{app}\ServiceInstall.exe'),
          '-u AIS_server "'+ ExpandConstant('{app}\AIS_server.exe')+'"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
   end;
end;

//卸载程序的时候判断是否在运行
function InitializeUninstall(): Boolean;
begin
  begin
  //密码验证
  //Result :=  AskPassword();
  Result := TRUE;
//  DelTree(ExpandConstant('{app}\*'), False, True, True);
  end
end;

//提示卸载完后重启计算机
function UninstallNeedRestart(): Boolean;
begin
   Result := False;
   DelTree(ExpandConstant('{app}\*'), False, True, True);
   DelTree(ExpandConstant('{app}'), True, True, True);
end;
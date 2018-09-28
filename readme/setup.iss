ʾ��1��Ӧ�ó���.exe���ͻ��˰�װ����

;{089D6802-6CD3-4E45-B8D5-AC9ED99CE371}; �ű��� Inno Setup �ű��� ���ɣ�
; �йش��� Inno Setup �ű��ļ�����ϸ��������İ����ĵ���

[Setup]
; ע: AppId��ֵΪ������ʶ��Ӧ�ó���
; ��ҪΪ������װ����ʹ����ͬ��AppIdֵ��
; (�����µ�GUID����� ����|��IDE������GUID��)
AppId={{5E012E21-42EE-4840-A000-35F9FAB886E9}
AppName=AIS_Client
AppVerName=AIS_Client
AppPublisher=��˾��

DefaultDirName={pf}\AIS_Client
DefaultGroupName=AIS_Client
OutputBaseFilename=AIS_Client
Compression=lzma
SolidCompression=yes
SetupIconFile=D:\AIS\AIS �������\AISGUI.ico
LicenseFile=C:\Documents and Settings\Administrator\����\���Э��.txt

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "D:\AIS\AIS �������\AIS_client_exe\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; ע��: ��Ҫ���κι���ϵͳ�ļ���ʹ�á�Flags: ignoreversion��

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Icons]
Name: "{group}\AIS�ͻ���"; Filename: "{app}\AISGUI.exe"
Name: "{group}\AIS�ͻ��˲������ù���"; Filename: "{app}\ClientConfig.exe"
Name: "{group}\AIS�������ù���"; Filename: "{app}\ServiceIPManage.exe"
Name: "{group}\AIS���ݿ�������ù���"; Filename: "{app}\DataBaseConfig.exe"
;Name: "{group}\�ſط����"; Filename: "{app}\Access_server\SecurityWare.exe"
;�ڿ�ʼ�˵�->���г���->������ͯ�����һ��ɾ����ݼ���
Name: "{group}\ж��"; Filename: {uninstallexe}
Name: "{commondesktop}\AIS�ͻ���"; Filename: "{app}\AISGUI.exe"; Tasks: desktopicon
;Name: "{commondesktop}\�ſط����"; Filename: "{app}\Access_server\SecurityWare.exe"; Tasks: desktopicon

[Run]
;Filename: "{app}\Access_server\SecurityWare.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec
Filename: "{app}\AISGUI.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec

[Registry]
;��ӿ�������
Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName:"ais"; ValueData:"{app}\AISGUI.exe";  Flags:uninsdeletevalue

[Code]
{ж��ʱ�ж��������Ƿ�������}
var
is_Sys , is_value: integer;
S_syschar, S_currentchar, S_current,S_sys, S,ResultStr : string;
I ,CloseNum: Integer;
ErrorCode: Integer;
Guid_names,window_name : TArrayOfString;
bool  : Boolean;
const AppName='{5E012E21-42EE-4840-A000-35F9FAB886E9}_is1';

{����װǰ�ж��������Ƿ�������}
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  if RegGetSubkeyNames(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',Guid_names) then
  begin
    for I:=0 to GetArrayLength(Guid_names)-1 do
    begin
      S := Guid_names[i];
      //ע������ҵ��˴˼�
      if AppName=Guid_names[i] then
      begin
        bool := RegQueryStringValue(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\'+S,'UninstallString',ResultStr);
        //ResultStr := RemoveQuotes(ResultStr);
        if bool then
        begin
          if MsgBox('��װ�����⵽��ǰ������Ѿ���װ��AIS�ͻ��ˡ�' #13#13 '���Ƿ�Ҫж��AIS�ͻ��ˣ�',  mbConfirmation, MB_YESNO) = IDYES then
            //   ShellExec('', ExpandConstant('{app}\unins000.exe'), '','', SW_SHOW, ewNoWait, ResultCode);
            begin
              Exec(RemoveQuotes(ResultStr), '', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
              Result := false;
            end
        end
        break;
      end
      else
      //zdx 5.8 �ж��Ƿ��Ѿ�����һ����װ����
      begin
        if FindWindowbyWindowName('��װ - AIS_Client')<>0 then
        begin
          MsgBox('��װ�����⵽������һ����װ�����Ѿ���������', mbConfirmation, MB_OK);
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

//���û�����cancel��ʱ��ɾ����������ϵͳ���ļ���
procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
end ;

//ж��������֤����
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
Form.Caption := '������֤';
Form.BorderIcons := [biSystemMenu];
Form.BorderStyle := bsDialog;
Form.Center;

OKButton := TButton.Create(Form);
OKButton.Parent := Form;
OKButton.Width := ScaleX(75);
OKButton.Height := ScaleY(23);
OKButton.Left := Form.ClientWidth - ScaleX(75 + 6 + 75 + 50);
OKButton.Top := Form.ClientHeight - ScaleY(23 + 10);
OKButton.Caption := 'ȷ��';
OKButton.ModalResult := mrOk;
OKButton.Default := true;

CancelButton := TButton.Create(Form);
CancelButton.Parent := Form;
CancelButton.Width := ScaleX(75);
CancelButton.Height := ScaleY(23);
CancelButton.Left := Form.ClientWidth - ScaleX(75 + 50);
CancelButton.Top := Form.ClientHeight - ScaleY(23 + 10);
CancelButton.Caption := 'ȡ��';
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
         MsgBox('�������', mbInformation, MB_OK);
end;
   finally
Form.Free();
   end;
end;

//ж�س����ʱ���ж��Ƿ�������
function InitializeUninstall(): Boolean;
begin
  begin
  //������֤
  //Result :=  AskPassword();
  Result := TRUE;
//  DelTree(ExpandConstant('{app}\*'), False, True, True);
  end
end;

//��ʾж��������������
function UninstallNeedRestart(): Boolean;
begin
   Result := False;
   DelTree(ExpandConstant('{app}\*'), False, True, True);
   DelTree(ExpandConstant('{app}'), True, True, True);
end;

 

ʾ��2��windows service������˰�װ����

;{089D6802-6CD3-4E45-B8D5-AC9ED99CE371}; �ű��� Inno Setup �ű��� ���ɣ�
; �йش��� Inno Setup �ű��ļ�����ϸ��������İ����ĵ���

[Setup]
; ע: AppId��ֵΪ������ʶ��Ӧ�ó���
; ��ҪΪ������װ����ʹ����ͬ��AppIdֵ��
; (�����µ�GUID����� ����|��IDE������GUID��)
AppId={{D0D0B722-C6F9-4A89-AB56-1417B9BD1400}
AppName=AIS_Server
AppVerName=AIS_Server
AppPublisher=��˾��

DefaultDirName={pf}\AIS_Server
DefaultGroupName=AIS_Server
OutputBaseFilename=AIS_Server
Compression=lzma
SolidCompression=yes
SetupIconFile=D:\AIS\AIS �������\AISGUI.ico
LicenseFile=C:\Documents and Settings\Administrator\����\���Э��.txt

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "D:\AIS\AIS �������\AIS_server_exe\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; ע��: ��Ҫ���κι���ϵͳ�ļ���ʹ�á�Flags: ignoreversion��

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Icons]
Name: "{group}\AIS����˲������ù���"; Filename: "{app}\ServiceConfig.exe"
;Name: "{group}\AIS�ͻ���"; Filename: "{app}\AIS_client_exe\AISGUI.exe"
;Name: "{group}\�ſط����"; Filename: "{app}\Access_server\SecurityWare.exe"
;�ڿ�ʼ�˵�->���г���->������ͯ�����һ��ɾ����ݼ���
Name: "{group}\ж��"; Filename: {uninstallexe}
;Name: "{commondesktop}\AIS�ͻ���"; Filename: "{app}\AIS_client_exe\AISGUI.exe"; Tasks: desktopicon
;Name: "{commondesktop}\�ſط����"; Filename: "{app}\Access_server\SecurityWare.exe"; Tasks: desktopicon

[Run]
;Filename: "{app}\Access_server\SecurityWare.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec
;Filename: "{app}\AIS_client_exe\AISGUI.exe"; Description: "{cm:LaunchProgram,AIS}"; Flags: nowait postinstall skipifsilent shellexec

[Registry]
;��ӿ�������
;Root: HKLM; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName:"bwqc"; ValueData:"{app}\MSrv.exe";  Flags:uninsdeletevalue

[Code]
{ж��ʱ�ж��������Ƿ�������}
var
is_Sys , is_value: integer;
S_syschar, S_currentchar, S_current,S_sys, S,ResultStr : string;
I ,CloseNum: Integer;
ErrorCode: Integer;
Guid_names,window_name : TArrayOfString;
bool  : Boolean;
const AppName='{D0D0B722-C6F9-4A89-AB56-1417B9BD1400}_is1';

{����װǰ�ж��������Ƿ�������}
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  if RegGetSubkeyNames(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',Guid_names) then
  begin
    for I:=0 to GetArrayLength(Guid_names)-1 do
    begin
      S := Guid_names[i];
      //ע������ҵ��˴˼�
      if AppName = Guid_names[i] then
      begin
        bool := RegQueryStringValue(HKEY_LOCAL_MACHINE,'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\'+S,'UninstallString',ResultStr);
        //ResultStr := RemoveQuotes(ResultStr);
        if bool then
        begin
           if MsgBox('��װ�����⵽��ǰ������Ѿ���װ��AIS_Server��' #13#13 '���Ƿ�Ҫж��AIS_Server��',  mbConfirmation, MB_YESNO) = IDYES then
            //   ShellExec('', ExpandConstant('{app}\unins000.exe'), '','', SW_SHOW, ewNoWait, ResultCode);
            begin
              Exec(RemoveQuotes(ResultStr), '', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
              Result := false;
            end
        end
        break;
      end
      else
      //zdx 5.8 �ж��Ƿ��Ѿ�����һ����װ����
      begin
        if FindWindowbyWindowName('��װ - AIS_Server')<>0 then
        begin
          MsgBox('��װ�����⵽������һ����װ�����Ѿ���������', mbConfirmation, MB_OK);
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

//���û�����cancel��ʱ��ɾ����������ϵͳ���ļ���
procedure CancelButtonClick(CurPageID: Integer; var Cancel, Confirm: Boolean);
begin
end ;

//ж��������֤����
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
Form.Caption := '������֤';
Form.BorderIcons := [biSystemMenu];
Form.BorderStyle := bsDialog;
Form.Center;

OKButton := TButton.Create(Form);
OKButton.Parent := Form;
OKButton.Width := ScaleX(75);
OKButton.Height := ScaleY(23);
OKButton.Left := Form.ClientWidth - ScaleX(75 + 6 + 75 + 50);
OKButton.Top := Form.ClientHeight - ScaleY(23 + 10);
OKButton.Caption := 'ȷ��';
OKButton.ModalResult := mrOk;
OKButton.Default := true;

CancelButton := TButton.Create(Form);
CancelButton.Parent := Form;
CancelButton.Width := ScaleX(75);
CancelButton.Height := ScaleY(23);
CancelButton.Left := Form.ClientWidth - ScaleX(75 + 50);
CancelButton.Top := Form.ClientHeight - ScaleY(23 + 10);
CancelButton.Caption := 'ȡ��';
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
         MsgBox('�������', mbInformation, MB_OK);
end;
   finally
Form.Free();
   end;
end;

procedure CurStepChanged(CurStep: TSetupStep);//��ӻ�������
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

//ж�س����ʱ���ж��Ƿ�������
function InitializeUninstall(): Boolean;
begin
  begin
  //������֤
  //Result :=  AskPassword();
  Result := TRUE;
//  DelTree(ExpandConstant('{app}\*'), False, True, True);
  end
end;

//��ʾж��������������
function UninstallNeedRestart(): Boolean;
begin
   Result := False;
   DelTree(ExpandConstant('{app}\*'), False, True, True);
   DelTree(ExpandConstant('{app}'), True, True, True);
end;

import { DICT_TYPE } from './constant'

//线路数据
let roadNames = ['01路', '04路', '1001路', '1002路', '1003路', '1004路', '1005路', '1006路', '1007路', '1008路', '1009路', '100路', '1010路', '1011路', '1012路', '1013路', '1014路', '1015路', '1016路', '1017路', '1018路', '1019路', '101路', '1020路', '1021路', '1022路', '1023路', '1024路', '1025路', '1026路', '1027路', '1028路', '1029路', '102路', '1030路', '1031路', '1032路', '1033路', '1034路', '1035路', '1036路', '1037路', '1038路', '1039路', '103路', '1040路', '1041路', '1042路', '1043路', '1045路', '1046路', '1047路', '1048路', '1049路', '104路', '1050路', '1051路', '1052路', '1053路', '1054路', '1055路', '1056路', '1057路', '1058路', '1059路', '105路', '1060路', '1061路', '1062路', '1063路', '1064路', '1065路', '1066路', '1067路', '1068路', '1069路', '106路', '1070路', '1071路', '1072路', '1073路', '1074路', '1075路', '1076路', '1077路', '1078路', '1079路', '107路', '1080路', '1081路', '1082路', '1083路', '1084路', '1085路', '1086路', '1087路', '1088路', '1089路', '108路', '108区间', '1090路', '1091路', '1092路', '1093路', '1094路', '1095路', '1096路', '1097路', '1098路', '1099路', '109路', '1100路', '1101路', '1102路', '1103路', '1104路', '1105路', '1106路', '1107路', '1108路', '1109路', '110路', '1110路', '1111路', '1112路', '1113路', '1115路', '1116路', '1117路', '1118路', '1119路', '111路', '1120路', '1121路', '1122路', '1123路', '1124路', '1126路', '1127路', '1128路', '1129路', '112路', '112区间', '1130路', '1131路', '113路', '1156路', '1157路', '1158路', '115路', '116B', '117路', '118路', '119路', '11路', '1201路', '1202路', '1203路', '1204B', '1204路', '1205路', '1206路', '1207路', '1208路', '1209路', '120路', '1210路', '1212路', '1216路', '1217路', '1218路', '1219路', '121路', '1220路', '1221路', '1222路', '1223路', '1226路', '1227路', '1228路', '1229路', '122路', '1231路', '1238路', '123路', '123区间', '124路', '1250路', '1250路（71路支线1）', '1251路', '1251路（71路支线2）', '1258路', '129路', '130路', '131路', '132路', '133路', '134路', '135路', '136路', '137路', '138路', '139路', '13路', '140路', '141路', '142路', '143路', '143区间', '144路', '145路', '146路', '147路', '149路', '14路', '1501路', '150路', '151路', '152路', '155路', '157路', '158路', '159路', '15路', '1600路', '1601路', '1602路', '1603路', '1604路', '1605路', '1606路', '1607路', '1608路', '1609路', '160路', '1610路', '1611路', '1612路', '161路', '162路', '163路', '1650路', '1651路', '1657路', '165路', '1662路', '166路', '167路', '168路', '169路', '1711路', '1712路', '171路', '1721路', '172路', '1731路', '173路', '174路', '175路', '176路', '177路', '178路', '178路大站车', '179路', '17路', '180路', '181路', '182路', '183路', '184路', '185路', '187路', '188路', '188南汇', '189路', '189区间', '18路', '190路', '192路', '193路', '195路', '197路', '198路', '19路', '205路', '206路', '20路', '210路', '216路', '218路', '219路', '21路', '220路', '222路', '224路', '22路', '23路', '24路', '252路', '253路', '257路', '25路', '26路', '28路', '301路', '302路', '303路', '304路', '305路', '306路', '307路', '308路', '309路', '310路', '311路', '312路', '313路', '314路', '315路', '316路', '317路', '318路', '319路', '320路', '321路', '322路', '323路', '324路', '325路', '326路', '327路', '328路', '329路', '330路', '332路', '338路', '339路', '33路', '340路', '341路', '342路', '36路', '37路', '405路', '406路', '40路', '41路', '42路', '43路', '44路', '451路', '453路', '454路', '455路', '45路', '46路', '46路区间', '47路', '48路', '49路', '502路', '508路', '50路', '50路区间', '510路', '519路', '51路', '522路', '527路', '528路', '52路', '537路', '538路', '547路', '548路', '54路', '551路', '552路', '554路', '559路', '55路', '561路', '56路', '56区间', '572路', '572路区间1(三林)路', '573路', '576路', '577路', '57路', '581路', '583路', '58路', '597路', '59路', '604路', '607路', '609路', '60路', '610路', '611路', '614路', '615路', '61路', '624路', '627路', '628路', '629路', '62路', '630路', '632路', '636路', '638路', '639路', '63路', '640路', '64路', '65路', '66路', '66区间', '67路', '68路', '69路', '6路', '700路', '701路', '702路', '703B路', '703路', '704B路', '704路', '705路', '707路', '708路', '709路', '70路', '711路', '712路', '713路', '714路', '715路', '716路', '717路', '718路', '719路', '71路', '71路区间', '720路', '721路', '722路', '723路', '724路', '725路', '726路', '727路', '728路', '729路', '72路', '730路', '731路', '732路', '733路', '734路', '735路', '736路', '737路', '738路', '739路', '740路', '741路', '742路', '743路', '744路', '745路', '746路', '747路', '748路', '749路', '74路', '750路', '751路', '752路', '753路', '754路', '755路', '757路', '758路', '759路', '760路', '761路', '762路', '763路', '764路', '765路', '766路', '767路', '768路', '76路', '770路', '772路', '774路', '775路', '776路', '777路', '778路', '779路', '780路', '781路', '782路', '783路', '784路', '785路', '786路', '787路', '789路', '78路', '790路', '791路', '792路', '793路', '794路', '795路', '796路', '798路', '799路', '79路', '803路', '804路', '805路', '807路', '808路', '809路', '80路', '810路', '811路', '812路', '813路', '815路', '817路', '818路', '819路', '81路', '820路', '821路', '823路', '824路', '825路', '826路', '827路', '828路', '829路', '82路', '830路', '831路', '832路', '833路', '834路', '835路', '836路', '837路', '838路', '839路', '83路', '841路', '842路', '843路', '845路', '846路', '849路', '84路', '850路', '853路', '854路', '855路', '856路', '858路', '859路', '85路', '862路', '863路', '864路', '866路', '867路', '868路', '869路', '870路', '871路', '873路', '874路', '875路', '876路', '877路', '878路', '879路', '87路', '881路', '882路', '883路', '88路', '89路', '8路', '909路', '90路', '911路', '912路', '915路', '91路', '920路', '921路', '923路', '926路', '927路', '929路', '92B路', '92路', '930路', '931路', '932路', '933路', '934路', '937路', '939路', '93路', '941路', '941路跨线定班', '942路', '944路', '946路', '947路', '948路', '94路', '950路', '951路', '952B', '952路', '955路', '958路', '959路', '95路', '960路', '961路', '962路', '963路', '966路', '969路', '96路', '970路', '971路', '973路', '974路', '975路', '976路', '977路', '978路', '97路', '980路', '981路', '983路', '984路', '985路', '986路', '986路区间', '987路', '988路', '989路', '98路', '990路', '991路', '991路区间', '992路', '993路', '995路', '99路', '安虹线', '安亭2路', '安亭4路', '安亭6路', '安亭7路', '安亭8路', '宝山10路', '宝山11路', '宝山12路', '宝山13路', '宝山14路', '宝山15路', '宝山16路', '宝山17路', '宝山18路', '宝山19路', '宝山1路', '宝山20路', '宝山21路', '宝山22路', '宝山23路', '宝山25路', '宝山26路', '宝山27路', '宝山28路', '宝山29路', '宝山2路', '宝山30路', '宝山31路', '宝山35路', '宝山36路', '宝山3路', '宝山4路', '宝山5路', '宝山6路', '宝山7路', '宝山81路', '宝山82路', '宝山83路', '宝山84路', '宝山85路', '宝山86路', '宝山87路', '宝山88路', '宝山89路', '宝山8路', '宝山90路', '宝山91路', '宝山92路', '宝山93路', '宝山95路', '宝山9路', '堡陈北线', '堡陈中线', '堡陈专线', '堡红线', '堡进线', '堡七线', '堡胜专线', '堡四线', '北安跨线', '北安线', '北蔡1路', '北蔡2路', '蔡陆专线', '曹路1路', '曹路2路', '曹路3路', '曹路4路', '漕泾一路', '陈凤线', '陈前线', '城桥1路', '城桥2路', '城桥3路', '崇明东滩1路', '崇明东滩2路', '崇明乡村10路', '崇明乡村11路', '崇明乡村1路', '崇明乡村3路', '崇明乡村4路', '崇明乡村5路', '崇明乡村6路', '崇明乡村7路', '崇明乡村8路', '崇明乡村9路', '川奉专线', '川航专线', '川芦专线', '川沙2路', '川沙3路', '川沙4路', '川沙5路', '大泥专线', '大桥六线', '大桥三线', '大桥四线', '大桥五线', '大桥一线', '大团2路', '枫泾七路', '枫梅线', '枫戚快线', '奉城1线', '奉城2线', '奉城3线', '奉城4线', '奉燎线', '奉南线', '奉浦快线（区间）', '奉卫线', '奉贤10路', '奉贤11路', '奉贤12路', '奉贤13路', '奉贤15路', '奉贤16路', '奉贤18路', '奉贤1路', '奉贤21路', '奉贤22路', '奉贤23路', '奉贤24路', '奉贤25路', '奉贤26路', '奉贤27路', '奉贤3路', '奉贤8路', '奉贤9路', '高川专线', '古美环线', '国际旅游度假区1路', '国际旅游度假区2路', '国际旅游度假区3路', '海湾1线', '海湾3线', '航大专线', '航奉专线', '航头3路', '航头4路', '航头5路', '合庆1路', '合庆2路', '鹤莘线', '横沙2路', '横沙3路', '横长线', '虹桥枢纽10路', '虹桥枢纽1路', '虹桥枢纽4路', '虹桥枢纽5路', '虹桥枢纽7路', '虹桥枢纽9路', '沪川线', '沪嘉专线', '沪南线', '沪松专线', '沪唐专线', '沪塘专线', '花木1路', '花木2路', '惠川线', '惠临专线', '惠芦专线', '惠南10路', '惠南11路', '惠南1路', '惠南2路', '惠南3路', '惠南4路', '惠南5路', '惠南6路', '惠南8路', '惠书专线', '机场一线', '机场二线', '机场四线', '机场五线', '机场九线', '机场环一线', '机场八线', '机场七线', '嘉定101路', '嘉定102路', '嘉定103路', '嘉定104路', '嘉定105路', '嘉定106路', '嘉定107路（A线）', '嘉定107路（B线）', '嘉定108路', '嘉定109路', '嘉定10路', '嘉定110路', '嘉定111路', '嘉定112路', '嘉定113路', '嘉定114路', '嘉定115路', '嘉定116路', '嘉定117路', '嘉定118路', '嘉定119路', '嘉定11路', '嘉定120路', '嘉定121路', '嘉定122路', '嘉定123路', '嘉定124路', '嘉定125路', '嘉定126路', '嘉定127路', '嘉定12路', '嘉定13路', '嘉定14路', '嘉定15路', '嘉定15路区间', '嘉定16路', '嘉定17路', '嘉定18路', '嘉定19路', '嘉定1路', '嘉定20路', '嘉定21路', '嘉定2路', '嘉定3路', '嘉定4路', '嘉定51路', '嘉定52路', '嘉定53路', '嘉定54路', '嘉定55路', '嘉定56路', '嘉定57路', '嘉定58路', '嘉定59路', '嘉定5路', '嘉定60路', '嘉定61路', '嘉定62路', '嘉定63路', '嘉定64路', '嘉定65路', '嘉定66路', '嘉定67路', '嘉定68路', '嘉定69路', '嘉定6路', '嘉定70路', '嘉定7路', '嘉定8路', '嘉定9路', '嘉松线', '嘉泰线', '嘉唐华线', '江川3路', '江桥1路', '江桥4路', '江五线', '金漕线', '金枫线', '金汇1线', '金桥1路', '金山1路', '金山2路', '金山3路', '金山4路', '金山5路', '金山6路', '金山7路', '金山8路', '金山9路', '金山9路区间', '金山工业区二路', '金山工业区一路', '金山卫二路', '金山卫一路', '金石线', '金张卫支线', '菊园1路', '老港1路', '两滨专线', '临港2路', '六灶2路', '龙大专线', '龙东专线', '龙港快线', '龙惠专线', '龙临专线', '龙芦专线', '龙南定班线', '龙新芦专线', '芦潮港1路', '芦杜专线', '陆安高速', '陆安高速B', '陆安线(高速)', '陆安线(高速)B', '陆家嘴金融城1路', '陆家嘴金融城2路', '陆家嘴金融城3路', '陆家嘴金融城4路', '陆家嘴金融城5路', '陆家嘴金融城环线', '罗泾班线', '马陆1路', '闵东线', '闵行11路', '闵行16路', '闵行1路', '闵行20路', '闵行22路', '闵行26路', '闵行28路', '闵行29路', '闵行30路', '闵行31路', '闵行33路', '闵行35路', '闵行36路', '闵行39路', '闵行40路', '闵行41路', '闵马线', '闵吴线', '南堡二线', '南堡支线', '南堡专线', '南川线', '南东专线', '南风线', '南海二线', '南海线', '南航线', '南红专线', '南华专线', '南建专线', '南江线', '南江专线', '南金线', '南燎专线', '南隆专线', '南梅线', '南闵专线', '南南线', '南牛线', '南青专线', '南邵线', '南松专线', '南同专线', '南头专线', '南团线', '南卫线', '南五线', '南翔4路', '南翔5路', '南新专线', '南新专线（崇明）', '南叶线', '南裕专线', '南园1路', '南跃线', '泥城1路', '泥城2路', '泥城4路', '泥城5路', '浦东10路', '浦东11路', '浦东12路', '浦东13路', '浦东14路', '浦东15路', '浦东17路', '浦东18路', '浦东19路', '浦东1路', '浦东20路', '浦东21路', '浦东22路', '浦东23路', '浦东24路', '浦东25路', '浦东26路', '浦东27路', '浦东28路', '浦东29路', '浦东2路', '浦东30路', '浦东31路', '浦东32路', '浦东33路', '浦东34路', '浦东35路', '浦东36路', '浦东37路', '浦东38路', '浦东39路', '浦东3路', '浦东41路', '浦东42路', '浦东43路', '浦东45路', '浦东46路', '浦东47路', '浦东48路', '浦东4路', '浦东50路', '浦东50路区间', '浦东51路', '浦东52路', '浦东6路', '浦东7路', '浦东8路', '浦东9路', '浦江11路', '浦江1路', '浦江2路', '浦江3路', '浦江4路', '浦江5路', '浦江6路', '浦江7路', '浦卫线', '浦卫专线', '浦卫专线(定班)', '浦西滨江1路', '青村1线', '青村2线', '青枫专线', '青纪线', '青浦11路', '青浦12路', '青浦13路', '青浦14路', '青浦15路', '青浦1路', '青浦23路', '青浦2路', '青浦3路', '青浦4路', '青浦8路', '三林1路', '山阳二路', '山阳二路工业区', '山阳一路', '山阳一路区间', '上川专线', '上奉专线', '上嘉线', '上佘定班线', '上石线', '邵鹤线', '申崇二线', '申崇二线区间', '申崇六线', '申崇六线B', '申崇六线B(崇明巴士)', '申崇七线', '申崇三线', '申崇三线区间', '申崇四线', '申崇四线区间', '申崇五线', '申崇五线班车', '申崇一线', '申川专线', '申方专线', '申港1路', '申港3路', '申港4路', '莘车线', '莘金专线', '莘南高速线', '莘南专线', '莘团线', '莘庄1路', '莘庄2路', '莘庄3路', '施崂专线', '石漕线', '石胡专线', '石化三线', '石化一线', '石梅线', '石南专线', '石青专线', '书院2路', '书院3路', '四团1线', '四团2线', '四团3线', '松江11路', '松江12路', '松江13路', '松江16路', '松江17路', '松江1路', '松江20路', '松江21路', '松江22路', '松江23路', '松江24路', '松江25路', '松江27路', '松江28路', '松江31路', '松江33路', '松江36路', '松江3路', '松江4路', '松江64路', '松江66路', '松江7路', '松江99路', '松江9路', '松闵线', '松亭石专线', '松卫线', '松卫线(定班)', '松卫专线', '松新枫线', '隧道八线', '隧道二线', '隧道九线', '隧道六线', '隧道三线', '隧道夜宵一线', '隧道一线', '孙桥1路', '塘南专线', '塘卫线', '亭林三路', '外高桥1路', '外高桥2路', '外高桥3路', '外高桥4路', '外罗线', '万祥2路', '万周专线', '西莲线', '新场1路', '新场2路', '新场3路', '新场5路', '新川专线', '新嘉专线', '新泾1路', '新芦专线', '徐川专线', '徐闵线', '徐闵夜宵专线', '宣桥1路', '洋山专线', '洋山专线区间', '张江1路', '张江环线', '张南专线', '张堰二路', '张堰一路', '长南线', '长兴1路', '长兴2路', '长兴3路', '长兴4路', '长征1路', '柘林1线', '柘林2线', '真新1路', '周康10路', '周康1路', '周康2路', '周康3路', '周康4路', '周康5路', '周康6路', '周康9路', '周南线', '朱泾五路', '朱钱卫线', '朱松线', '朱卫线', '朱卫专线', '祝桥1路', '祝桥2路', '祝桥3路', '庄行1线', '庄行2线', '庄莘线', '庄莘线区间']

//获取线路名称数组 [{name}]
let getRoadDictsArray = function () {
	let objArray = []
	for (let i = 0; i<roadNames.length ; i++){
		objArray.push({
			'type' : DICT_TYPE.DICT_TYPE_BUS_ROAD,
			'name' : roadNames[i],
			'sequence' : (i+1)
		})
	}
	return objArray
}

//线路是否提醒状态
let REMIND_STATUS = {
	REMIND_STATUS_STOP : 0,
	REMIND_STATUS_START : 1
}


export { getRoadDictsArray , REMIND_STATUS}

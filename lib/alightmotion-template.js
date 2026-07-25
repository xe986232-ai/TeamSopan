// ============================================================================
// alightmotion-template.js -- generator file project Alight Motion (.xml)
// yang layout & desainnya identik sama TiktokPreviewScene (MusicPlayerCard)
// di web preview.
//
// Strategi: bukan bikin XML dari nol, tapi pakai file .xml ASLI hasil export
// dari Alight Motion (dikasih user) sebagai TEMPLATE literal, lalu di titik-
// titik tertentu (yang nilainya unik/nggak nabrak angka lain di file) kita
// substitusi pakai data dari web (judul, artist, device, durasi, opacity
// card, blur background). Ini jauh lebih aman daripada nulis ulang skema AM
// manual, karena semua node lain (posisi, animasi tombol, dst) tetap
// persis kayak project asli yang udah teruji render-nya di app AM.
//
// KETERBATASAN YANG DIKETAHUI (bukan bug, tapi cara kerja format AM):
//   - AM nyimpen foto lewat referensi `content://media/...` ke galeri HP,
//     BUKAN embed file di dalam XML. Jadi 2 slot foto (background & album
//     cover) di file hasil generate TETAP nunjuk ke foto placeholder dari
//     project asli. User HARUS pilih ulang foto yang sama dari galeri pas
//     pertama kali import project ini ke Alight Motion (sekali klik per
//     slot foto). Label layer-nya sengaja ditandai jelas biar gampang nemu.
//   - Animasi progress bar / equalizer / tombol kontrol adalah "chrome"
//     statis dari template asli (bukan hasil kalkulasi dari state web),
//     karena AM nggak baca posisi playhead lagu asli seperti browser.
// ============================================================================

const AM_TEMPLATE_XML = `<?xml version='1.0' encoding='UTF-8' ?><!--
Created by Alight Motion (http://alightmotion.com)
Exported: 2026-07-25 07:01 PM
5.0.275 (1002592)
a34a6c0 (7 Okt 2024 18.17.29)
-->
<scene title="Music play || aseppreset&#127903;️" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="32665" fps="60" modifiedTime="1784977311096" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="freeze" retimeAdaptFPS="false">
  <media uri="content://media/external/images/media/1001202055" type="image/jpeg" duration="0" orientation="0" infoUpdated="1779547296622" width="0" height="0" />
  <media uri="content://media/external/audio/media/1001202050" filename="#kireysixten - janji nyawee.mp3" title="#kireysixten - janji nyawee.mp3" type="audio/mpeg" duration="32616000" size="1305089" infoUpdated="1779547585035" />
  <media uri="content://media/external/images/media/1001202058" type="image/jpeg" duration="0" orientation="0" infoUpdated="1779547939256" width="0" height="0" />
  <bookmark t="20116" />
  <bookmark t="48016" />
  <bookmark t="29350" />
  <shape id="6212679" tag="+darkblue" label="Background album || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="media" fillImage="content://media/external/images/media/1001202055" mediaFillMode="stretch" s=".rect">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <scale value="1.231771,1.231771" />
    </transform>
    <effect id="com.alightcreative.effects.tile" locallyApplied="true">
      <property name="scale" type="float" value="1.000000" />
      <property name="phase" type="float" value="0.000000" />
      <property name="mirror" type="bool" value="true" />
      <property name="vertoffs" type="bool" value="false" />
      <property name="angle" type="float" value="0.000000" />
    </effect>
    <effect id="com.alightcreative.effects.gaussianblur" locallyApplied="true">
      <property name="strength" type="float" value="1.500000" />
    </effect>
    <property name="size" type="vec2" value="540.000000,960.000000" />
  </shape>
  <shape id="6212680" tag="+ruby" label="Tollbar || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="color" mediaFillMode="stretch" s=".roundrect">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <opacity value="0.601563" />
    </transform>
    <fillColor value="#ff000000" />
    <shadow direction="outside" enabled="false">
      <size value="5.000000" />
      <offset value="5.000000,5.000000" />
    </shadow>
    <property name="size" type="vec2" value="450.000000,732.000000" />
    <property name="cornerRadius" type="float" value="110.000000" />
  </shape>
  <embedScene id="6212683" tag="+darkblue" label="Album foto(klik edit grup) || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="32665" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="0.000000,-282.500000" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="32665" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212682" label="1:1" startTime="0" endTime="32665" fillType="media" fillImage="content://media/external/images/media/1001202058" mediaFillMode="stretch" s=".rect">
        <transform>
          <location value="540.000000,677.500000,0.000000" />
          <scale value="0.728704,0.728704" />
        </transform>
        <property name="size" type="vec2" value="540.000000,540.000000" />
      </shape>
      <shape id="6212681" label="Persegi Panjang Bulat 2" startTime="0" endTime="32665" fillType="color" blending="mask" mediaFillMode="stretch" s=".roundrect">
        <transform>
          <location value="540.000000,677.500000,0.000000" />
          <scale value="3.890000,3.890000" />
        </transform>
        <fillColor value="#ff5a7252" />
        <property name="size" type="vec2" value="100.000000,100.000000" />
        <property name="cornerRadius" type="float" value="10.000000" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212725" tag="+ruby" label="Gatau ini ikon apaan&#128511; || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="-2147456016" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="341.493896,204.569214" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="5032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212721" label="Segi Tiga 1" startTime="0" endTime="5032" fillType="color" mediaFillMode="stretch" s=".triangle">
        <transform>
          <location value="881.493896,1171.080811,0.000000" />
          <scale value="0.185000,0.185000" />
        </transform>
        <property name="p1" type="vec2" value="-100.000000,100.000000" />
        <property name="p2" type="vec2" value="0.000000,-11.000000" />
        <property name="p3" type="vec2" value="100.000000,100.000000" />
        <property name="closed" type="bool" value="true" />
      </shape>
      <shape id="6212722" label="Busur 1" startTime="0" endTime="5032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="881.493896,1164.803101,0.000000" />
          <scale value="0.095000,0.095000" />
          <rotation value="135.000000" />
        </transform>
        <fillColor value="#ff484dcd" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="0.000000" />
        <property name="endAngle" type="float" value="90.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
      <shape id="6212723" label="Busur 1 Copy" startTime="0" endTime="5032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="881.493896,1164.803101,0.000000" />
          <scale value="0.160000,0.160000" />
          <rotation value="135.000000" />
        </transform>
        <fillColor value="#ff484dcd" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="0.000000" />
        <property name="endAngle" type="float" value="90.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
      <shape id="6212724" label="Busur 1 Copy 2" startTime="0" endTime="5032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="881.493896,1164.803101,0.000000" />
          <scale value="0.230000,0.230000" />
          <rotation value="135.000000" />
        </transform>
        <fillColor value="#ff484dcd" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="0.000000" />
        <property name="endAngle" type="float" value="90.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212728" tag="+darkblue" label="Watermark, contoh =  Spotify || aseppreset&#127903;️ (klik edit grup)" startTime="0" endTime="32665" fillType="intrinsic" outTime="-2147456016" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="336.195313,53.338989" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="5032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212727" label="Photo 1:1" startTime="0" endTime="5032" fillType="media" fillImage="content://media/external/images/media/13063" mediaFillMode="stretch" s=".rect">
        <transform>
          <location value="876.195313,1013.338928,0.000000" />
          <scale value="0.061111,0.061111" />
        </transform>
        <property name="size" type="vec2" value="540.000000,540.000000" />
      </shape>
      <shape id="6212726" label="Persegi Panjang Bulat 1" startTime="0" endTime="5032" fillType="color" blending="mask" mediaFillMode="stretch" s=".roundrect">
        <transform>
          <location value="876.195313,1013.338928,0.000000" />
          <scale value="0.320000,0.320000" />
        </transform>
        <fillColor value="#ffdefac5" />
        <property name="size" type="vec2" value="100.000000,100.000000" />
        <property name="cornerRadius" type="float" value="56.000000" />
      </shape>
    </scene>
  </embedScene>
  <text id="6212684" tag="+darkblue" label="Perangkat || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="color" mediaFillMode="stretch" size="18.000000" font="googlefonts?name=Roboto&amp;weight=500" wrapWidth="512" align="left">
    <transform>
      <location value="308.217743,1108.338867,0.000000" />
      <scale value="0.615234,0.615234" />
      <opacity value="0.701172" />
    </transform>
    <content>iPhone</content>
  </text>
  <text id="6212685" tag="+darkblue" label="Judul Musik || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="color" mediaFillMode="stretch" size="18.000000" font="googlefonts?name=Roboto&amp;weight=500" wrapWidth="790" align="left">
    <transform>
      <location value="483.227661,1152.892212,0.000000" />
      <scale value="0.841797,0.841797" />
    </transform>
    <content>Janji Nyawe wokwok</content>
  </text>
  <text id="6212733" tag="+darkblue" label="Artist || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="color" mediaFillMode="stretch" size="18.000000" font="googlefonts?name=Roboto&amp;weight=400" wrapWidth="790" align="left">
    <transform>
      <location value="481.217834,1205.892212,0.000000" />
      <scale value="0.836709,0.836709" />
      <opacity>
        <kf t="0.407654" v="1.000000" />
        <kf t="0.429082" v="1.000000" />
        <kf t="0.413777" v="0.388672" />
      </opacity>
    </transform>
    <content>@wnfx.</content>
  </text>
  <shape id="6212706" tag="+ruby" label="Slot replay || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="none" mediaFillMode="stretch" s=".line">
    <transform>
      <location value="207.603363,1239.887207,0.000000" />
      <scale value="0.531034,0.531034" />
      <opacity value="0.697266" />
    </transform>
    <fillColor value="#ffda6e92" />
    <path-stroke direction="centered" end-size="1.500000">
      <color value="#ff888888" />
      <size value="10.000000" />
    </path-stroke>
    <property name="p2" type="vec2" value="1350.000000,100.000000" />
    <property name="p1" type="vec2" value="-100.000000,100.000000" />
  </shape>
  <shape id="6212707" tag="+darkblue" label="Replay saat ini || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="none" mediaFillMode="stretch" s=".line">
    <transform>
      <location value="213.365967,1236.237061,0.000000" />
      <scale value="0.567535,0.567535" />
    </transform>
    <fillColor value="#ffda6e92" />
    <path-stroke direction="centered" end-size="1.500000">
      <color value="#ffffffff" />
      <size value="10.000000" />
    </path-stroke>
    <property name="p2" type="vec2">
      <kf t="0.000000" v="-100.000000,100.000000" />
      <kf t="1.470442" v="1255.000000,100.000000" />
      <kf t="0.999541" v="1259.000000,100.000000" />
    </property>
    <property name="p1" type="vec2" value="-100.000000,100.000000" />
  </shape>
  <embedScene id="6212732" tag="+darkblue" label="Durasi saat ini || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="32665" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="-246.000000,372.647095" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="48032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <text id="6212689" tag="+darkblue" label="Durasi saat ini" startTime="0" endTime="48032" fillType="color" mediaFillMode="stretch" size="18.000000" font="googlefonts?name=Open Sans&amp;weight=600" wrapWidth="512" align="left">
        <transform>
          <location value="294.000000,1332.647095,0.000000" />
          <scale value="0.544922,0.544922" />
        </transform>
        <effect id="com.alightcreative.effects.timecode" locallyApplied="true">
          <property name="rel" type="bool" value="false" />
          <property name="frames" type="bool" value="true" />
        </effect>
        <content>2:01</content>
      </text>
      <shape id="6212731" label="Persegi panjang 1" startTime="0" endTime="48032" fillType="color" blending="exclude" mediaFillMode="stretch" s=".rect">
        <transform>
          <location value="260.516510,1332.647095,0.000000" />
          <scale value="0.285000,0.285000" />
        </transform>
        <fillColor value="#ff6b8eb7" />
        <property name="size" type="vec2" value="100.000000,100.000000" />
      </shape>
    </scene>
  </embedScene>
  <text id="6212690" tag="+darkblue" label="Durasi total || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="color" mediaFillMode="stretch" size="18.000000" font="googlefonts?name=Open Sans&amp;weight=600" wrapWidth="512" align="left">
    <transform>
      <location value="994.717834,1332.647095,0.000000" />
      <scale value="0.544922,0.544922" />
    </transform>
    <content>00:32</content>
  </text>
  <embedScene id="6212700" tag="+ruby" label="Sebelumnya || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="-2147452016" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="-228.224030,473.759521" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="1032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212696" label="Bentuk 1 Copy 2" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch">
        <transform>
          <location value="329.717834,1434.069946,0.000000" />
          <scale value="0.106541,0.106541" />
          <rotation value="-180.000000" />
        </transform>
        <path d="M 135.45523 41.310436L -233.77719 245.81667C -246.70363 251.6431, -261.90582 245.88744, -267.7323 232.961C -269.22702 229.64479, -270.0 226.04883, -270.0 222.4113L -270.0 -220.14357C -270.0 -234.3224, -258.5058 -245.81667, -244.32692 -245.81667C -240.6894 -245.81667, -237.09341 -245.04367, -233.77719 -243.54893L 141.44148 -31.964111C 154.3679 -26.137669, 187.08286 -6.579154, 181.25641 6.3472776C 178.68277 12.057156, 141.1651 38.736786, 135.45523 41.310436Z" />
      </shape>
      <shape id="6212697" label="Bentuk 1 Copy 3" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch">
        <transform>
          <location value="285.000000,1434.069946,0.000000" />
          <scale value="0.106541,0.106541" />
          <rotation value="-180.000000" />
        </transform>
        <path d="M 135.45523 41.310436L -233.77719 245.81667C -246.70363 251.6431, -261.90582 245.88744, -267.7323 232.961C -269.22702 229.64479, -270.0 226.04883, -270.0 222.4113L -270.0 -220.14357C -270.0 -234.3224, -258.5058 -245.81667, -244.32692 -245.81667C -240.6894 -245.81667, -237.09341 -245.04367, -233.77719 -243.54893L 141.44148 -31.964111C 154.3679 -26.137669, 187.08286 -6.579154, 181.25641 6.3472776C 178.68277 12.057156, 141.1651 38.736786, 135.45523 41.310436Z" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212698" tag="+ruby" label="Pause || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="-2147452016" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="0.413330,474.069946" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="1032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212691" label="Persegi Panjang Bulat 2" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch" s=".roundrect">
        <transform>
          <location value="521.813354,1434.069946,0.000000" />
          <scale value="0.420000,0.420000" />
        </transform>
        <property name="size" type="vec2" value="30.000000,100.000000" />
        <property name="cornerRadius" type="float" value="10.000000" />
      </shape>
      <shape id="6212692" label="Persegi Panjang Bulat 2 Copy" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch" s=".roundrect">
        <transform>
          <location value="559.013306,1434.069946,0.000000" />
          <scale value="0.420000,0.420000" />
        </transform>
        <property name="size" type="vec2" value="30.000000,100.000000" />
        <property name="cornerRadius" type="float" value="10.000000" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212699" tag="+ruby" label="Berikutnya || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="-2147452016" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="229.138428,474.380371" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="1032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212693" label="Bentuk 1" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch">
        <transform>
          <location value="751.305420,1434.069946,0.000000" />
          <scale value="0.106541,0.106541" />
        </transform>
        <path d="M 135.45523 41.310436L -233.77719 245.81667C -246.70363 251.6431, -261.90582 245.88744, -267.7323 232.961C -269.22702 229.64479, -270.0 226.04883, -270.0 222.4113L -270.0 -220.14357C -270.0 -234.3224, -258.5058 -245.81667, -244.32692 -245.81667C -240.6894 -245.81667, -237.09341 -245.04367, -233.77719 -243.54893L 141.44148 -31.964111C 154.3679 -26.137669, 187.08286 -6.579154, 181.25641 6.3472776C 178.68277 12.057156, 141.1651 38.736786, 135.45523 41.310436Z" />
      </shape>
      <shape id="6212694" label="Bentuk 1 Copy" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch">
        <transform>
          <location value="795.805420,1434.069946,0.000000" />
          <scale value="0.106541,0.106541" />
        </transform>
        <path d="M 135.45523 41.310436L -233.77719 245.81667C -246.70363 251.6431, -261.90582 245.88744, -267.7323 232.961C -269.22702 229.64479, -270.0 226.04883, -270.0 222.4113L -270.0 -220.14357C -270.0 -234.3224, -258.5058 -245.81667, -244.32692 -245.81667C -240.6894 -245.81667, -237.09341 -245.04367, -233.77719 -243.54893L 141.44148 -31.964111C 154.3679 -26.137669, 187.08286 -6.579154, 181.25641 6.3472776C 178.68277 12.057156, 141.1651 38.736786, 135.45523 41.310436Z" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212712" tag="+ruby" label="Volume minimum || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="32665" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="-331.919922,614.460693" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="1032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212711" label="Busur 1" startTime="0" endTime="1032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="210.425812,1574.460693,0.000000" />
          <scale value="0.160000,0.160000" />
          <rotation value="225.000000" />
        </transform>
        <fillColor value="#ff5c52bb" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="-100.000000" />
        <property name="endAngle" type="float" value="189.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
      <shape id="6212708" label="Persegi Panjang Bulat 2" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch" s=".roundrect">
        <transform>
          <location value="197.211029,1574.460693,0.000000" />
          <scale value="0.085000,0.085000" />
        </transform>
        <property name="size" type="vec2" value="100.000000,100.000000" />
        <property name="cornerRadius" type="float" value="25.000000" />
      </shape>
      <shape id="6212710" label="Segi Tiga 1" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch" s=".triangle">
        <transform>
          <location value="195.211029,1574.460693,0.000000" />
          <scale value="0.205000,0.205000" />
          <rotation value="-90.000000" />
        </transform>
        <effect id="com.alightcreative.effects.smoothedges" hidden="true" locallyApplied="true">
          <property name="strength" type="float" value="0.040000" />
          <property name="maskToLayer" type="bool" value="false" />
        </effect>
        <property name="p1" type="vec2" value="-100.000000,100.000000" />
        <property name="p2" type="vec2" value="0.000000,-30.000000" />
        <property name="p3" type="vec2" value="100.000000,100.000000" />
        <property name="closed" type="bool" value="true" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212720" tag="+ruby" label="Pengatur volume || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="32665" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="250.895142,614.460693" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="5032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212702" tag="+ruby" label="slot" startTime="0" endTime="5032" fillType="none" mediaFillMode="stretch" s=".line">
        <transform>
          <location value="317.000000,1574.460693,0.000000" />
          <scale value="0.442228,0.442228" />
          <opacity value="0.703125" />
        </transform>
        <fillColor value="#ff90da48" />
        <effect id="com.alightcreative.effects.parenthelper" locallyApplied="true">
          <property name="scaleMode" type="int" value="0" />
          <property name="rotateMode" type="int" value="0" />
          <property name="scaleWeight" type="float" value="1.000000" />
          <property name="rotateWeight" type="float" value="1.000000" />
          <property name="autoRotate" type="int" value="0" />
          <property name="radiusAdjust" type="float" value="0.000000" />
        </effect>
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ff888888" />
          <size value="13.000000" />
        </path-stroke>
        <property name="p1" type="vec2" value="-100.000000,0.000000" />
        <property name="p2" type="vec2" value="1075.000000,0.000000" />
      </shape>
      <shape id="6212703" tag="+ruby" label="Pengatur" startTime="0" endTime="5032" fillType="none" mediaFillMode="stretch" s=".line">
        <transform>
          <location value="317.000000,1574.460693,0.000000" />
          <scale value="0.442228,0.442228" />
        </transform>
        <fillColor value="#ff90da48" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="13.000000" />
        </path-stroke>
        <property name="p1" type="vec2" value="-100.000000,0.000000" />
        <property name="p2" type="vec2" value="720.000000,0.000000" />
      </shape>
      <shape id="6212704" tag="+ruby" label="Lingkaran 1" startTime="0" endTime="5032" fillType="color" mediaFillMode="stretch" parent="6212703" s=".circle">
        <transform>
          <location value="710.608154,0.000000,0.000000" />
          <scale value="0.712302,0.712302" />
        </transform>
        <property name="size" type="vec2" value="100.000000,100.000000" />
      </shape>
    </scene>
  </embedScene>
  <embedScene id="6212719" tag="+ruby" label="Volume maximum || aseppreset&#127903;️" startTime="0" endTime="32665" fillType="intrinsic" outTime="-2147452016" mediaFillMode="stretch">
    <transform>
      <location value="540.000000,960.000000,0.000000" />
      <pivot value="331.091797,614.460693" />
    </transform>
    <fillColor value="#ff000000" />
    <scene title="" width="1080" height="1920" exportWidth="1080" exportHeight="1920" precompose="dynamicResolution" bgcolor="#00000000" totalTime="1032" fps="30" modifiedTime="0" amver="1002592" ffver="106" am="com.alightcreative.motion/5.0.275" amplatform="android" retime="off" retimeAdaptFPS="false">
      <shape id="6212714" label="Busur 1" startTime="0" endTime="1032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="862.609863,1574.460693,0.000000" />
          <scale value="0.160000,0.160000" />
          <rotation value="225.000000" />
        </transform>
        <fillColor value="#ff5c52bb" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="-100.000000" />
        <property name="endAngle" type="float" value="189.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
      <shape id="6212717" label="Busur 1 Copy" startTime="0" endTime="1032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="863.609863,1574.460693,0.000000" />
          <scale value="0.253509,0.253509" />
          <rotation value="225.000000" />
        </transform>
        <fillColor value="#ff5c52bb" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="-100.000000" />
        <property name="endAngle" type="float" value="189.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
      <shape id="6212718" label="Busur 1 Copy 2" startTime="0" endTime="1032" fillType="none" mediaFillMode="stretch" s=".arc">
        <transform>
          <location value="866.609863,1574.460693,0.000000" />
          <scale value="0.325940,0.325940" />
          <rotation value="225.000000" />
        </transform>
        <fillColor value="#ff5c52bb" />
        <path-stroke direction="centered" end-size="1.500000">
          <color value="#ffffffff" />
          <size value="3.000000" />
        </path-stroke>
        <property name="startAngle" type="float" value="-100.000000" />
        <property name="endAngle" type="float" value="189.000000" />
        <property name="radius" type="float" value="100.000000" />
        <property name="closed" type="bool" value="false" />
      </shape>
      <shape id="6212715" label="Persegi Panjang Bulat 2" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch" s=".roundrect">
        <transform>
          <location value="849.395142,1574.460693,0.000000" />
          <scale value="0.085000,0.085000" />
        </transform>
        <property name="size" type="vec2" value="100.000000,100.000000" />
        <property name="cornerRadius" type="float" value="25.000000" />
      </shape>
      <shape id="6212716" label="Segi Tiga 1" startTime="0" endTime="1032" fillType="color" mediaFillMode="stretch" s=".triangle">
        <transform>
          <location value="847.395142,1574.460693,0.000000" />
          <scale value="0.205000,0.205000" />
          <rotation value="-90.000000" />
        </transform>
        <effect id="com.alightcreative.effects.smoothedges" hidden="true" locallyApplied="true">
          <property name="strength" type="float" value="0.040000" />
          <property name="maskToLayer" type="bool" value="false" />
        </effect>
        <property name="p1" type="vec2" value="-100.000000,100.000000" />
        <property name="p2" type="vec2" value="0.000000,-30.000000" />
        <property name="p3" type="vec2" value="100.000000,100.000000" />
        <property name="closed" type="bool" value="true" />
      </shape>
    </scene>
  </embedScene>
  <audio id="102409584" label="#kireysixten - janji nyawee.mp3" startTime="0" endTime="32665" src="content://media/external/audio/media/1001202050" outTime="32633" mediaFillMode="fill">
    <gain>
      <kf t="0.898515" v="1.000000" />
      <kf t="0.961763" v="0.000000" e="cubicBezier 0.0 0.0 0.31777775 1.0" />
    </gain>
  </audio>
</scene>`;

// ============================================================================
// ALIGHT_MOTION_LAYERS -- daftar semua layer TOP-LEVEL di dalam AM_TEMPLATE_XML
// (urutan dari BAWAH ke ATAS persis kayak panel layer Alight Motion asli,
// karena di format AM elemen yang ditulis lebih DULU di XML dirender di
// PALING BAWAH tumpukan). Dipakai buat nampilin panel layer di web (biar
// user bisa pilih layer mana yang mau di-skip pas generate .xml) tanpa
// harus buka project-nya dulu di Alight Motion.
//
// `id`  -- harus PERSIS sama dengan atribut id="..." di AM_TEMPLATE_XML.
// `tag` -- nama elemen XML-nya (shape / embedScene / text), dipakai buat
//          nemuin pasangan tag penutupnya pas proses hapus layer.
// `label` -- nama layer yang ramah dibaca di panel web (label asli di XML
//            biasanya ada embel-embel "|| aseppreset🎃️" yang dibuang di sini).
// `locked` -- true buat layer yang sebaiknya JANGAN dihapus (background &
//             foto cover -- kalau dihapus, project AM-nya jadi rusak/kosong
//             total) -- checkbox-nya tetap bisa dipakai tapi dikasih
//             peringatan visual.
// ============================================================================
export const ALIGHT_MOTION_LAYERS = [
  { id: "6212719", tag: "embedScene", label: "Ikon volume maksimum" },
  { id: "6212720", tag: "embedScene", label: "Slider pengatur volume" },
  { id: "6212712", tag: "embedScene", label: "Ikon volume minimum" },
  { id: "6212699", tag: "embedScene", label: "Tombol berikutnya" },
  { id: "6212698", tag: "embedScene", label: "Tombol play/pause" },
  { id: "6212700", tag: "embedScene", label: "Tombol sebelumnya" },
  { id: "6212690", tag: "text", label: "Teks durasi total" },
  { id: "6212732", tag: "embedScene", label: "Teks durasi berjalan" },
  { id: "6212707", tag: "shape", label: "Progress bar (terisi)" },
  { id: "6212706", tag: "shape", label: "Progress bar (slot/track)" },
  { id: "6212733", tag: "text", label: "Teks artist" },
  { id: "6212685", tag: "text", label: "Teks judul musik" },
  { id: "6212684", tag: "text", label: "Teks nama device" },
  { id: "6212728", tag: "embedScene", label: "Watermark (contoh Spotify)" },
  { id: "6212725", tag: "embedScene", label: "Ikon dekorasi" },
  { id: "6212683", tag: "embedScene", label: "Foto sampul album", locked: true },
  { id: "6212680", tag: "shape", label: "Toolbar (kotak player)", locked: true },
  { id: "6212679", tag: "shape", label: "Background album (blur)", locked: true },
];

// hapus SATU blok layer top-level (dari tag pembuka sampai tag penutup yang
// SEJAJAR indentasinya -- 2 spasi persis) dari string XML. Karena struktur
// template ini flat/nggak ada top-level tag yang nested di dalam top-level
// tag lain dengan nama sama, pencarian non-greedy sampai closing tag
// berindentasi 2 spasi ini aman dipakai tanpa perlu parser XML sungguhan.
function stripLayerBlock(xml, { id, tag }) {
  const pattern = new RegExp(`\\n {2}<${tag} id="${id}"[\\s\\S]*?\\n {2}</${tag}>`, "");
  if (!pattern.test(xml)) {
    console.warn(`[alightmotion-template] layer id="${id}" (<${tag}>) tidak ketemu, mungkin template berubah.`);
    return xml;
  }
  return xml.replace(pattern, "");
}

function escapeXmlText(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeXmlAttr(str) {
  return escapeXmlText(str).replace(/"/g, "&quot;");
}

function formatFloat6(n) {
  return Number(n).toFixed(6);
}

function formatDurationMMSS(totalSeconds) {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0;
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// replace persis SATU kemunculan (biar aman kalau suatu saat template
// berubah dan token jadi nggak unik lagi -- ketimbang diam-diam salah ganti
// di banyak tempat, mendingan ketauan lewat console.warn)
function replaceOnce(xml, search, replacement, contextLabel) {
  const count = xml.split(search).length - 1;
  if (count !== 1) {
    console.warn(
      `[alightmotion-template] token "${search.slice(0, 40)}..." untuk "${contextLabel}" muncul ${count}x (harusnya 1x). Template mungkin berubah.`
    );
  }
  return xml.replace(search, replacement);
}

// replace SEMUA kemunculan token angka unik (endTime/totalTime durasi lagu)
function replaceAll(xml, search, replacement) {
  return xml.split(search).join(replacement);
}

/**
 * Generate file project Alight Motion (.xml) berdasarkan data dari web
 * preview, pakai template project musik player yang dikasih user.
 *
 * @param {Object} data
 * @param {string} data.title        - judul lagu
 * @param {string} data.artist       - handle/nama artist, mis. "@nama"
 * @param {string} data.device       - nama device, mis. "iPhone"
 * @param {number} data.durationSeconds - durasi lagu dalam detik
 * @param {number} data.bgOpacity    - 0-100, sama kayak slider "Opacity background card"
 * @param {number} data.bgBlur      - 0-100, sama kayak slider "Blur background belakang" (px, satuan CSS)
 * @param {string[]} data.excludedLayerIds - id layer (lihat ALIGHT_MOTION_LAYERS) yang mau DIBUANG dari project
 * @returns {string} isi file .xml siap didownload
 */
export function generateAlightMotionXml({
  title = "Judul Lagu",
  artist = "@artist",
  device = "iPhone",
  durationSeconds = 30,
  bgOpacity = 55,
  bgBlur = 64,
  excludedLayerIds = [],
} = {}) {
  let xml = AM_TEMPLATE_XML;

  // ---- 0. buang layer yang di-uncheck user di panel Layer (kalau ada
  //         token teks/warna punya layer itu yang mau disubstitusi di
  //         langkah-langkah selanjutnya, replaceOnce di bawah cuma bakal
  //         nge-warn di console -- gak error -- karena token-nya emang
  //         udah nggak ada lagi di dalam xml) ----
  if (excludedLayerIds?.length) {
    const excludedSet = new Set(excludedLayerIds);
    for (const layer of ALIGHT_MOTION_LAYERS) {
      if (excludedSet.has(layer.id)) {
        xml = stripLayerBlock(xml, layer);
      }
    }
  }

  // ---- 1. durasi: scene totalTime (ms) + endTime tiap layer top-level,
  //         audio media duration (µs), audio outTime (ms, sedikit lebih
  //         pendek biar gak nge-freeze frame terakhir) ----
  const safeDuration = Math.max(1, Number(durationSeconds) || 1);
  const totalMs = Math.round(safeDuration * 1000);
  const totalUs = Math.round(safeDuration * 1_000_000);
  const outMs = Math.max(0, totalMs - 32);

  xml = replaceAll(xml, "32665", String(totalMs)); // totalTime scene + semua endTime layer
  xml = replaceOnce(xml, 'duration="32616000"', `duration="${totalUs}"`, "audio media duration (µs)");
  xml = replaceOnce(xml, 'outTime="32633"', `outTime="${outMs}"`, "audio outTime (ms)");

  // ---- 2. teks: perangkat, judul, artist, durasi total ----
  xml = replaceOnce(xml, "<content>iPhone</content>", `<content>${escapeXmlText(device)}</content>`, "device");
  xml = replaceOnce(
    xml,
    "<content>Janji Nyawe wokwok</content>",
    `<content>${escapeXmlText(title)}</content>`,
    "title"
  );
  xml = replaceOnce(xml, "<content>@wnfx.</content>", `<content>${escapeXmlText(artist)}</content>`, "artist");
  xml = replaceOnce(
    xml,
    "<content>00:32</content>",
    `<content>${formatDurationMMSS(safeDuration)}</content>`,
    "durasi total"
  );
  // "Durasi saat ini" di-drive otomatis sama effect timecode di Alight
  // Motion, jadi cukup di-reset ke 0:00 sebagai tampilan awal
  xml = replaceOnce(xml, "<content>2:01</content>", "<content>0:00</content>", "durasi saat ini (awal)");

  // ---- 3. style: opacity card & blur background, dipetakan langsung dari
  //         nilai slider web (bgOpacity/bgBlur) ke satuan Alight Motion ----
  const cardOpacity = Math.min(1, Math.max(0, Number(bgOpacity) / 100));
  xml = replaceOnce(
    xml,
    '<opacity value="0.601563" />',
    `<opacity value="${formatFloat6(cardOpacity)}" />`,
    "opacity toolbar/card"
  );

  // strength efek gaussianblur AM & px CSS itu satuan beda. Mapping di
  // bawah didapat kalibrasi kasar dari nilai contoh (blur css ~64px kira2
  // setara strength ~1.5) -- kalau hasil render AM kerasa kurang/lebih blur
  // dari preview, angka pengali 1.5/64 ini yang perlu disesuaikan.
  const blurStrength = Math.max(0, (Number(bgBlur) / 64) * 1.5);
  xml = replaceOnce(
    xml,
    '<property name="strength" type="float" value="1.500000" />\n    </effect>\n    <property name="size" type="vec2" value="540.000000,960.000000" />',
    `<property name="strength" type="float" value="${formatFloat6(blurStrength)}" />\n    </effect>\n    <property name="size" type="vec2" value="540.000000,960.000000" />`,
    "gaussianblur strength"
  );

  // ---- 4. tandain layer foto yang WAJIB dipilih ulang manual di AM
  //         (keterbatasan format, lihat catatan di atas file ini) ----
  xml = replaceOnce(
    xml,
    'label="Background album || aseppreset&#127903;️"',
    'label="⚠️ GANTI FOTO INI - Background album"',
    "label background album"
  );
  xml = replaceOnce(
    xml,
    'label="Album foto(klik edit grup) || aseppreset&#127903;️"',
    'label="⚠️ GANTI FOTO INI - Album foto (klik edit grup)"',
    "label album foto"
  );

  // ---- 5. judul project ----
  xml = replaceOnce(
    xml,
    'title="Music play || aseppreset&#127903;️"',
    `title="${escapeXmlAttr(title)} - Sopan TikTok Overlay"`,
    "judul project"
  );

  return xml;
}

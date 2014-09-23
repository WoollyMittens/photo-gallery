[<?php
	// DEBUG MODE
	error_reporting(E_ALL);
	ini_set('display_errors', '1');

	// CONSTANTS
	$info = intval(@$_REQUEST['inf']);
	$index = intval(@$_REQUEST['idx']);
	$amount = intval(@$_REQUEST['amt']);

	$group = @$_REQUEST['grp'];
	if($group=='') $group = '0,1,2';
	$group = ',' . $group . ',';

// %3C img %20 src %3D %22 fred %22 / %3E

	$slides = array(
		array("article", "gallery_slide_0", "", "%3Ch3%3E1.%20Lorem%20ipsum%3C/h3%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_0.jpg%22/%3E%3Cp%3ELorem%20ipsum%20dolor%20sit%20amet,%20consectetur%20adipisicing%20elit,%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Lorem%20ipsum%20dolor%20sit%20amet%22%3EMore%3C/a%3E%3C/p%3E", 1),
		array("figure", "gallery_slide_1", "", "%3Ca%20href=%22#%22%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_0a.jpg%22/%3E%3C/a%3E%3Cfigcaption%3E2.%20Excepteur%20sint%20occaecat%3C/figcaption%3E", 2),
		array("article", "gallery_slide_2", "", "%3Ch3%3E3.%20Duis%20aute%20irure%20dolor%3C/h3%3E%3Cp%3EDuis%20aute%20irure%20dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%3C/p%3E%3Cp%3EExcepteur%20sint%20occaecat%20cupidatat%20non%20proident,%20sunt%20in%20culpa%20qui%20officia%20deserunt%20mollit%20anim%20id%20est%20laborum.%3Ca%20href=%22#%22%20title=%22More%20about%20Duis%20aute%20irure%20dolor%22%3EMore%3C/a%3E%3C/p%3E", 0),
		array("article", "gallery_slide_3", "", "%3Ch3%3E4.%20Lorem%20ipsum%3C/h3%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_1.jpg%22/%3E%3Cp%3ELorem%20ipsum%20dolor%20sit%20amet,%20consectetur%20adipisicing%20elit,%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Lorem%20ipsum%20dolor%20sit%20amet%22%3EMore%3C/a%3E%3C/p%3E", 1),
		array("figure", "gallery_slide_4", "", "%3Ca%20href=%22#%22%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_1a.jpg%22/%3E%3C/a%3E%3Cfigcaption%3E5.%20Excepteur%20sint%20occaecat%3C/figcaption%3E", 2),
		array("article", "gallery_slide_5", "", "%3Ch3%3E6.%20Duis%20aute%20irure%20dolor%3C/h3%3E%3Cp%3EDuis%20aute%20irure%20dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%3C/p%3E%3Cp%3EExcepteur%20sint%20occaecat%20cupidatat%20non%20proident,%20sunt%20in%20culpa%20qui%20officia%20deserunt%20mollit%20anim%20id%20est%20laborum.%3Ca%20href=%22#%22%20title=%22More%20about%20Duis%20aute%20irure%20dolor%22%3EMore%3C/a%3E%3C/p%3E", 0),
		array("article", "gallery_slide_6", "", "%3Ch3%3E7.%20Lorem%20ipsum%3C/h3%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_2.jpg%22/%3E%3Cp%3ELorem%20ipsum%20dolor%20sit%20amet,%20consectetur%20adipisicing%20elit,%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Lorem%20ipsum%20dolor%20sit%20amet%22%3EMore%3C/a%3E%3C/p%3E", 1),
		array("figure", "gallery_slide_7", "", "%3Ca%20href=%22#%22%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_2a.jpg%22/%3E%3C/a%3E%3Cfigcaption%3E8.%20Excepteur%20sint%20occaecat%3C/figcaption%3E", 2),
		array("article", "gallery_slide_8", "", "%3Ch3%3E9.%20Duis%20aute%20irure%20dolor%3C/h3%3E%3Cp%3EDuis%20aute%20irure%20dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%3C/p%3E%3Cp%3EExcepteur%20sint%20occaecat%20cupidatat%20non%20proident,%20sunt%20in%20culpa%20qui%20officia%20deserunt%20mollit%20anim%20id%20est%20laborum.%3Ca%20href=%22#%22%20title=%22More%20about%20Duis%20aute%20irure%20dolor%22%3EMore%3C/a%3E%3C/p%3E", 0),
		array("article", "gallery_slide_9", "", "%3Ch3%3E10.%20Lorem%20ipsum%3C/h3%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_3.jpg%22/%3E%3Cp%3ELorem%20ipsum%20dolor%20sit%20amet,%20consectetur%20adipisicing%20elit,%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Lorem%20ipsum%20dolor%20sit%20amet%22%3EMore%3C/a%3E%3C/p%3E", 1),
		array("figure", "gallery_slide_10", "", "%3Ca%20href=%22#%22%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_3a.jpg%22/%3E%3C/a%3E%3Cfigcaption%3E11.%20Excepteur%20sint%20occaecat%3C/figcaption%3E", 2),
		array("article", "gallery_slide_11", "", "%3Ch3%3E12.%20Duis%20aute%20irure%20dolor%3C/h3%3E%3Cp%3EDuis%20aute%20irure%20dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%3C/p%3E%3Cp%3EExcepteur%20sint%20occaecat%20cupidatat%20non%20proident,%20sunt%20in%20culpa%20qui%20officia%20deserunt%20mollit%20anim%20id%20est%20laborum.%3Ca%20href=%22#%22%20title=%22More%20about%20Duis%20aute%20irure%20dolor%22%3EMore%3C/a%3E%3C/p%3E", 0),
		array("article", "gallery_slide_12", "", "%3Ch3%3E13.%20Lorem%20ipsum%3C/h3%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_4.jpg%22/%3E%3Cp%3ELorem%20ipsum%20dolor%20sit%20amet,%20consectetur%20adipisicing%20elit,%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Lorem%20ipsum%20dolor%20sit%20amet%22%3EMore%3C/a%3E%3C/p%3E", 1),
		array("figure", "gallery_slide_13", "", "%3Ca%20href=%22#%22%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_4a.jpg%22/%3E%3C/a%3E%3Cfigcaption%3E14.%20Excepteur%20sint%20occaecat%3C/figcaption%3E", 2),
		array("article", "gallery_slide_14", "", "%3Ch3%3E15.%20Duis%20aute%20irure%20dolor%3C/h3%3E%3Cp%3EDuis%20aute%20irure%20dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%3C/p%3E%3Cp%3EExcepteur%20sint%20occaecat%20cupidatat%20non%20proident,%20sunt%20in%20culpa%20qui%20officia%20deserunt%20mollit%20anim%20id%20est%20laborum.%3Ca%20href=%22#%22%20title=%22More%20about%20Duis%20aute%20irure%20dolor%22%3EMore%3C/a%3E%3C/p%3E", 0),
		array("article", "gallery_slide_15", "", "%3Ch3%3E16.%20Lorem%20ipsum%3C/h3%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_5.jpg%22/%3E%3Cp%3ELorem%20ipsum%20dolor%20sit%20amet,%20consectetur%20adipisicing%20elit,%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Lorem%20ipsum%20dolor%20sit%20amet%22%3EMore%3C/a%3E%3C/p%3E", 1),
		array("figure", "gallery_slide_16", "", "%3Ca%20href=%22#%22%3E%3Cimg%20alt=%22%22%20src=%22./inc/img/figure_5a.jpg%22/%3E%3C/a%3E%3Cfigcaption%3E17.%20Excepteur%20sint%20occaecat%3C/figcaption%3E", 2),
		array("article", "gallery_slide_17", "", "%3Ch3%3E18.%20Duis%20aute%20irure%20dolor%3C/h3%3E%3Cp%3EDuis%20aute%20irure%20dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%3C/p%3E%3Cp%3EExcepteur%20sint%20occaecat%20cupidatat%20non%20proident,%20sunt%20in%20culpa%20qui%20officia%20deserunt%20mollit%20anim%20id%20est%20laborum.%20%3Ca%20href=%22#%22%20title=%22More%20about%20Duis%20aute%20irure%20dolor%22%3EMore%3C/a%3E%3C/p%3E", 0)
	);

	// FUNCTIONS
	function returnSlides($index, $amount, $group, $slides){
		$a = $index;
		$found = 0;
		while($found<$amount && $a<count($slides)){
			if(
				strpos(
					$group,
					(',' . $slides[$a][4] . ',')
				) !== false
			){
				echo '{"element":"' . $slides[$a][0] . '",' .
				'"id":"' . $slides[$a][1] . '",' .
				'"class":"' . $slides[$a][2] . '",' .
				'"html":"' . $slides[$a][3] . '",' .
				'"group":"' . $slides[$a][4] . '"},' ;
				$found += 1;
			}
			$a += 1;
		}
	}

	function reportAmount($group, $slides){
		$found = 0;
		for($a=0; $a<count($slides); $a+=1){
			if(
				strpos(
					$group,
					(',' . $slides[$a][4] . ',')
				) !== false
			){
				$found += 1;
			}
		}
		echo $found - 1;
	}
	if($info==1){
		reportAmount($group, $slides);
	}else{
		returnSlides($index, $amount, $group, $slides);
		reportAmount($group, $slides);
	}

	// Test URLs:
	// http://localhost/~Woolly/Gourmet/webservices/pinboardcarousel.php?inf=1
	// http://localhost/~Woolly/Gourmet/webservices/pinboardcarousel.php?idx=3&amt=5&grp=0&itm=0,1,2,3,4,5

?>]

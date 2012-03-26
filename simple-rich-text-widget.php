<?php
/*
Plugin Name: Simple Rich Text Widget
Plugin URI: http://www.blogseye.com
Description: Widget to display a list of recent search engine query keywords in a link to the wp search function.
Author: Keith P. Graham
Version: 1.1
Author URI: http://www.blogseye.com
Tested up to: 3.3

*/

class widget_kpg_srtw extends WP_Widget {

/*	function x__construct() {
		$widget_ops = array('classname' => 'widget_kpg_srtw', 'description' => __('Simple Rich Text Editor Widget'));
		$control_ops = array('width' => 330, 'height' => 310);
		parent::__construct('widget_kpg_srtw', __('Simple Rich Text Widget'), $widget_ops, $control_ops);
	}
*/
   /** constructor */
    function widget_kpg_srtw() {
 		//$widget_ops = array('classname' => 'widget_kpg_srtw', 'description' => __('Simple Rich Text Editor Widget'));
		$control_ops = array('width' => 400, 'height' => 330);
       parent::WP_Widget(false, $name = 'Simple Rich Text Widget', null, $control_ops);
       //parent::WP_Widget(false, $name = 'Simple Rich Text Widget');
		// create the javascript for the thing
		?>
<?php
    }
   /** @see WP_Widget::widget */
    function widget($args, $instance) {	
		// this is the html to display the options in the sidebar
		extract( $args ); // after_widget, etc
		
		$title = esc_attr($instance['title']);
		$richtext = $instance['richtext'];
		echo "\n\n<!-- start Simple Rich Text Widget -->\n\n";
		echo $before_widget;
		if ( ! empty( $title ) )
			echo $before_title . $title . $after_title;
		
		// display the rich text here
		
		echo $richtext;
		echo $after_widget;
		echo "\n\n<!-- End of Simple Rich Text Widget -->\n\n";
	}

    /** @see WP_Widget::update */
    function update($new_instance, $old_instance) {				
		// processes widget options to be saved
		// have to update the new instance
		return $new_instance;
	}

    /** @see WP_Widget::form */
    function form($instance) {
		if (!empty($instance)) {
			$title = esc_attr($instance['title']);
			$richtext = esc_attr($instance['richtext']);
		} else {
			$title = "Simple Rich Text Widget";
			$richtext = "simple rich text goes here";
		}
		// get the images and script location
		$dir = WP_PLUGIN_URL.'/'.str_replace(basename( __FILE__),"",plugin_basename(__FILE__));
		$js = addslashes($dir.'wishywig.js');
		if (empty($richtext)) $richtext='<p>&nbsp;</p>';
		?>
<div style="position:relative;width:400px;">

  <label for="<?php echo $this->get_field_id('title'); ?>" style="line-height:25px;display:block;"> Title:
  <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
  </label>
  <label for="<?php echo $this->get_field_id('richtext'); ?>" style="line-height:25px;display:block;width:38px">
    <textarea name="<?php echo $this->get_field_name('richtext'); ?>" cols="72" rows="16" class="c<?php echo $this->get_field_id('richtext'); ?>" id="<?php echo $this->get_field_id('richtext'); ?>" style="width:400px;height:300px;"><?php echo $richtext;?></textarea>
   </label>
   <p>&nbsp;</p>
<script type="text/javascript" src="<?php echo $js; ?>"></script>
<script type="text/javascript">
     WishyWig.wishywig("<?php echo $this->get_field_id('richtext'); ?>");

</script>   
</div>

<?PHP
	}

}
add_action('widgets_init', create_function('', 'return register_widget("widget_kpg_srtw");'));
// end of widget class

// below is the admin screen

function  widget_kpg_srtw_admin() {
	// this is the admin page
	// use for default options and advertising
	?>
<div class="wrap">
<h2>Simple Rich Text Widget</h2>
<h4>The Simple Rich Text Widget is installed and working correctly.</h4><div style="position:relative;float:right;width:35%;background-color:ivory;border:#333333 medium groove;padding:4px;margin-left:4px;">
    <p>This plugin is free and I expect nothing in return. If you would like to support my programming, you can buy my book of short stories.</p>
    <p>Some plugin authors ask for a donation. I ask you to spend a very small amount for something that you will enjoy. eBook versions for the Kindle and other book readers start at 99&cent;. The book is much better than you might think, and it has some very good science fiction writers saying some very nice things. <br/>
      <a target="_blank" href="http://www.blogseye.com/buy-the-book/">Error Message Eyes: A Programmer's Guide to the Digital Soul</a></p>
    <p>A link on your blog to one of my personal sites would also be appreciated.</p>
    <p><a target="_blank" href="http://www.WestNyackHoney.com">West Nyack Honey</a> (I keep bees and sell the honey)<br />
      <a target="_blank" href="http://www.cthreepo.com/blog">Wandering Blog</a> (My personal Blog) <br />
      <a target="_blank" href="http://www.cthreepo.com">Resources for Science Fiction</a> (Writing Science Fiction) <br />
      <a target="_blank" href="http://www.jt30.com">The JT30 Page</a> (Amplified Blues Harmonica) <br />
      <a target="_blank" href="http://www.harpamps.com">Harp Amps</a> (Vacuum Tube Amplifiers for Blues) <br />
      <a target="_blank" href="http://www.blogseye.com">Blog&apos;s Eye</a> (PHP coding) <br />
      <a target="_blank" href="http://www.cthreepo.com/bees">Bee Progress Beekeeping Blog</a> (My adventures as a new beekeeper) </p>
  </div>

<p>I needed a very simple way to add formatted text to the sidebar on my blog. I used this simple plugin along with an old rich text javascript file that I wrote and wound up with this. It works on my blogs, but the javascript may not work if oyu are using anything but the default admin pages in WordPress.
</p>
<p>
I have been testing with FireFox 10 and IE8. I hope that other browsers work. In any case, the widget display should be well formed and standard HTML and display pretty much the same in all browsers. This is the first release and I have been chasing down bugs. Please let me know immediately it it doesn't work for you.
</p>
</div>
<?php

}
function widget_kpg_srtw_admin_menu() {
   add_options_page('Simple Rich Text Widget', 'Simple Rich Text Widget', 'manage_options','keywords_widget','widget_kpg_srtw_admin' );
}

add_action('admin_menu', 'widget_kpg_srtw_admin_menu');
?>

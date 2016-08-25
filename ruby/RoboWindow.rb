require './CoreGraphics'
require './Phases/LoadPhase'

class RoboWindow < FXMainWindow
  def initialize(app, db)
    super(app, "Robo", :width => 800, :height => 600)

    @canvas = FXCanvas.new(self, :opts => LAYOUT_FILL_X|LAYOUT_FILL_Y|LAYOUT_TOP|LAYOUT_LEFT)
    @phase = nil
    @db = db
    @canvas.connect(SEL_LEFTBUTTONPRESS) do |sender, sel, event|
      @canvas.grab
      @phase.on_leftbuttonpress event
    end
    @canvas.connect(SEL_MOTION) do |sender, sel, event|
      @phase.on_motion event
    end
    @canvas.connect(SEL_LEFTBUTTONRELEASE) do |sender, sel, event|
      @canvas.ungrab
      @phase.on_leftbuttonrelease event
    end
  end

  def draw
    ctx = FXDCWindow.new(@canvas)
    yield(ctx)
    ctx.end
  end

  def onTimeout(sender, sel, ptr)
    @phase.update
    @phase.draw

    getApp.addTimeout(20, method(:onTimeout))
    return 1
  end

  # Create and show the main window
  def create
    super
    # font = FXFont.new(app,'Arial,100')
    # font.create
    # txt = db.execute("SElECT value FROM Meta WHERE key='foo'")[0][0]
    # img = File.open('test.png', 'rb')
    # fximg = FXPNGImage.new(app, img.read, 0, 374, 448)
    # fximg.create
    # img.close
    # window.draw do |ctx|
    #   ctx.foreground = 'black'
    #   ctx.font = font
    #   ctx.drawText(0, window.height, txt)
    #
    #   ctx.drawImage(fximg, 100, 100)
    # end

    cg = CoreGraphics.new getApp, self
    f = FXFont.new(app,'Arial,240')
    f.create
    cg.register_files(['test'], '.png')
    cg.register_animation('fourier', 'png')
    cg.load
    @phase = LoadPhase.new({
      :cg => cg,
      :window => self,
      :font => f
    })
    # cg.begin
    # cg.pdraw('test').move_animated(:SMOOTH, 300, 200, 0) { |img| img.kill }
    # cg.pdraw('test', 1, 0, 100)
    # cg.adraw('fourier', 0, 300, 300).move_animated(:LINEAR, 100, 300, 200) { }


    getApp.addTimeout(20, method(:onTimeout))
    show(PLACEMENT_SCREEN) # Make the main window appear
  end
end

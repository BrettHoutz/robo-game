require 'sqlite3'
require 'fox16'
include Fox
require './RoboWindow'

def open_db
  datapath = File.open('datapath')
  db = SQLite3::Database.new(datapath.read + 'data')
  datapath.close
  unless db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Meta'")[0]
    db.execute_batch File.read('init.sql')
  end
  yield(db)
  db.close
end

def create_app

end

open_db do |db|
  app = FXApp.new('Robo', 'Robo') #second arg is vendor name
  window = RoboWindow.new(app, db)
  app.create
  app.run
end

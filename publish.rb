#!/usr/bin/env ruby

# Script to move publish a draft
# e.g. command:
# $ ./publish.rb _drafts/my-draft.md
require 'fileutils'

# Some constants
TARGET_DIR = "_posts"

# Get the filename which was passed as an argument
draft_path = ARGV[0]
draft_filename = draft_path[8..-1]
post_filename = "#{Time.now.strftime('%Y-%m-%d')}-#{draft_filename.downcase}"
post_filepath = File.join(TARGET_DIR, post_filename)

# move the draft over to publish it
FileUtils.mv(draft_path, post_filepath)

puts "moved #{draft_path} => #{post_filepath}"

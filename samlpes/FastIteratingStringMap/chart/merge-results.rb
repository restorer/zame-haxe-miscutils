#!/usr/bin/ruby

require 'json'

class ResultsMerger
    def initialize
        @result = []
    end

    def load(file_name)
        data = JSON.parse(File.read(file_name))

        data.each do |benchmark|
            found = false

            @result.each do |res_benchmark|
                if benchmark['benchmark'] == res_benchmark['benchmark']
                    res_benchmark['browsers'] += benchmark['browsers']
                    found = true
                    break
                end
            end

            @result << benchmark unless found
        end
    end

    def process
        load('results-chrome.json')
        load('results-safari.json')
        load('results-firefox.json')

        result_text = JSON.generate(@result, {
            :indent => '    ',
            :space => ' ',
            :object_nl => "\n",
            :array_nl => "\n",
        })

        File.write('results-merged.js', "window.data = #{result_text};\n")
    end
end

ResultsMerger.new.process()

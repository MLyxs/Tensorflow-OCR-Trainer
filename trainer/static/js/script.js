$(document).ready(function(){
    $('select').material_select();
    $(".button-collapse").sideNav();

    var layer_types = {
        "conv2d": "conv2d",
        "max_pool2d": "max_pool2d",
        "l2_normalize": "l2_normalize",
        "batch_norm": "batch_norm",
        "mdrnn": "mdrnn",
        "birnn": "birnn",
        "dropout": "dropout",
        "collapse_to_rnn_dims": "collapse_to_rnn_dims"
    };

    function populate(selector, values) {
        $.each(values, function(key, value){
            $(selector).append($('<option>', {value: key}).text(value))
        });
    }

    function create_selector(key, placeholder_text, values) {
        var placeholder = $('<option>', {"value": ""})
            .prop('disabled', true)
            .prop('selected', true).text(placeholder_text);
        var selector = $('<select>', {"name": key})
            .prop('required', true)
            .append(placeholder);
        populate(selector, values);
        return selector
    }

    function create_int_input_field(input_name) {
        var input_id = Math.floor(Math.random() * 2147483647) + "-" + Math.floor(Math.random() * 2147483647);
        return $('<input>').attr({'type': 'number', 'step': "1", 'min': "1", "name": input_name, "id": input_id}).prop('required', true)
    }

    var paddings = {
        "same": "same",
        "valid": "valid"
    };

    var cell_types = {
        "LSTM": "LSTM",
        "GRU": "GRU",
        "GLSTM": "GLSTM"
    };

    var activation_functions = {
        "tanh": "tanh",
        "relu": "relu",
        "relu6": "relu6"
    };

    function create_network_layer_param(key){
        return "network[][" + key + "]"
    }

    var conv2d_params = function() {
        return {"Num Filters": create_int_input_field(create_network_layer_param("num_filters")),
                "Kernel Size": create_int_input_field(create_network_layer_param("kernel_size"))
                    .prop('multiple', true),
                "Stride": create_int_input_field(create_network_layer_param("stride"))
                    .prop('multiple', true),
                "Padding": create_selector(create_network_layer_param("padding"), "Select padding", paddings)}
    };

    var maxpool2d_params = function() {
        return {"Pool size": create_int_input_field(create_network_layer_param("pool_size")),
                "Stride": create_int_input_field(create_network_layer_param("stride")).prop('multiple', true),
                "Padding": create_selector(create_network_layer_param("padding"), "Select padding", paddings)}
    };

    var mdrnn_params = function() {
        return {"Num Hidden": create_int_input_field(create_network_layer_param("num_hidden")),
                "Kernel Size": create_int_input_field(create_network_layer_param("kernel_size")).prop('multiple', true),
                "Cell Type": create_selector(create_network_layer_param("cell_type"), "Select cell type", cell_types),
                "Activation": create_selector(create_network_layer_param("activation"), "Select activation", activation_functions)}
    };

    var birnn_params = function() {
        return {"Num Hidden": create_int_input_field(create_network_layer_param("num_hidden")),
                "Cell Type": create_selector(create_network_layer_param("cell_type"), "Select cell type", cell_types),
                "Activation": create_selector(create_network_layer_param("activation"), "Select activation", activation_functions)}
    };

    var l2_normalize_params = function() {
        return {"Axis": create_int_input_field(create_network_layer_param("axis")).prop('multiple', true)}
    };

    var dropout_params = function() {
        return {"Keep Prob": $('<input>').attr({'type': 'number',
            'step': "any", "max": "1", "min": "0.000001",  "name": create_network_layer_param("keep_prob")}).prop('required', true)
            .attr('placeholder', 'Keep Prob')}
    };

    var layer_params = {
        "conv2d": conv2d_params,
        "max_pool2d": maxpool2d_params,
        "mdrnn": mdrnn_params,
        "birnn": birnn_params,
        "l2_normalize": l2_normalize_params,
        "dropout": dropout_params
    };

    $('#add-layer').click(function (e) {
        e.preventDefault();
        var layer_type_selector = create_selector(create_network_layer_param("layer_type"), "Select layer type", layer_types);
        $('#layers').append(
            $('<li>', {"class": "collection-item row overflowing"}).append(
                $($('<ul>', {"class": "layer"})).append($('<ul>', {"class": "layer_parameters"}))
                    .prepend(
                    $('<li>', {"class": "input-field col s2"}).append(
                        $(layer_type_selector)
                            .change(
                                function () {
                                    var layer_type = $(this).val();
                                    var params_container = $(this).parent().parent().parent().children('.layer_parameters');
                                    params_container.empty();

                                    function append_layer_params(input_fields){
                                        $.each(input_fields, function(key, input_field){
                                            var input_field_label = $('<label>', {'for': input_field.attr('id')});
                                            input_field_label.text(input_field_label.text() + key);
                                            params_container.append(
                                                $('<li>', {"class": "input-field col s2"})
                                                    .append(input_field)
                                                    .append($(input_field_label))
                                            );
                                            if (input_field.is('select')){
                                                input_field.material_select();
                                            }
                                        });
                                    }
                                    append_layer_params(layer_params[layer_type]());
                                }
                            )
                        )
                    )
                )
        );
        layer_type_selector.material_select();
        $('select').material_select();
    });
});
